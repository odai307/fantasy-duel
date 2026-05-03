# FantasyDuel Architecture Audit (Docker Excluded)

Date: 2026-05-02
Scope: `backend/` and `frontend/` only

## 1) Baseline Architecture Map

### Runtime boundaries and data flow
1. Browser routes resolve in `frontend/src/App.jsx`.
2. Route pages call domain API helpers (`authApi`, `poolApi`, `duelApi`, `leaderboardApi`) which wrap `apiRequest` from `frontend/src/apiClient.js`.
3. Requests hit Express modules mounted in `backend/src/index.js`:
   - `/api/auth`
   - `/api/pools`
   - `/api/duels`
   - `/api/leaderboard`
4. Backend flow is mostly: `route -> controller -> validation -> service -> Prisma`.
5. Domain persistence is in PostgreSQL via Prisma models in `backend/prisma/schema.prisma` (`User`, `Pool`, `PoolParticipant`, `Duel`).

### Module ownership and coupling hotspots
- `auth`: authentication lifecycle and token issuance.
- `pools`: pool creation, listing, access checks, participation, leaderboard.
- `duels`: duel creation, join-by-code, user-scoped listing and details.
- `leaderboard`: global ranking aggregation across pools + duels.

Hotspots:
- Duplicate error envelope and handling logic per controller (`sendError` repeated).
- Duplicate invite-code utilities in pools and duels services.
- Frontend pages hold significant data/interaction logic and presentation together (especially pool/duel details).
- Cross-stack contract assumptions are implicit (no shared contract schema/types).

## 2) Backend Architecture Audit

### Findings (ordered by severity)

#### High
1. **Inconsistent auth semantics for optional-auth endpoints can mask invalid session state**
- Evidence: optional middleware swallows invalid/expired tokens and continues as anonymous (`backend/src/shared/middleware/optionalAuthMiddleware.js:18-23`).
- Impact: client may believe it is authenticated while request is treated as public; harder to reason about user experience and auditing.
- Proposed fix: normalize optional-auth behavior to include explicit request auth context (`authenticated: false|true`) and optionally return token-invalid metadata, while still allowing public access.
- Effort: Medium
- Risk: Low-Medium (behavioral changes must preserve public access paths).

2. **Race-safety pattern is uneven between modules**
- Evidence: duel join uses conditional `updateMany` inside transaction to protect contention (`backend/src/duels/duelService.js:164-180`); pool join checks count then creates participant in same transaction but without a conditional write lock on pool capacity (`backend/src/pools/poolService.js:381-399`).
- Impact: under concurrent joins near capacity, pool fullness checks rely on timing and may be brittle at high contention.
- Proposed fix: use a single conditional capacity enforcement strategy (e.g., row-level lock or guarded update counter) for pools similar to duel contention handling.
- Effort: Medium
- Risk: Medium (touches join path correctness).

3. **Leaderboard service computes full in-memory ranking on every request**
- Evidence: reads all users + grouped stats and sorts in process (`backend/src/leaderboard/leaderboardService.js:32-100`).
- Impact: request cost grows with user base; paging is applied after full aggregation.
- Proposed fix: move ranking to pre-aggregated table/materialized view or incremental stats pipeline, and page at DB layer.
- Effort: Medium-High
- Risk: Medium

#### Medium
4. **Error taxonomy and controller behavior are duplicated and not centralized**
- Evidence: repeated `sendError` functions across auth/pool/duel/leaderboard controllers.
- Impact: inconsistencies likely as API grows; harder to add correlation IDs/observability.
- Proposed fix: centralized HTTP error class hierarchy + global error middleware + uniform response envelope.
- Effort: Medium
- Risk: Low

5. **Configuration source of truth is split**
- Evidence: `backend/src/index.js` reads `process.env` directly for `PORT` and `FRONTEND_URL` while `shared/config/env.js` exists.
- Impact: harder to guarantee validated configuration contract.
- Proposed fix: consume only `env` object in app bootstrap.
- Effort: Low
- Risk: Low

6. **Join/create monetary flows are not domain-complete yet**
- Evidence: TODOs for wallet atomic debit in both pools and duels joins (`backend/src/pools/poolService.js:392`, `backend/src/duels/duelService.js:195`).
- Impact: future paid-game correctness risk if payment logic is bolted on without transaction boundaries.
- Proposed fix: design a wallet ledger transaction boundary before enabling paid-entry enforcement.
- Effort: Medium
- Risk: Medium-High

#### Low
7. **Invite-code generation and normalization logic is duplicated**
- Evidence: mirrored helpers across pools and duels services.
- Impact: drift risk and repeated bug surfaces.
- Proposed fix: shared domain utility module.
- Effort: Low
- Risk: Low

8. **Limited production telemetry hooks**
- Evidence: no structured request logging/correlation IDs/latency metrics pipeline at app level.
- Impact: difficult incident diagnosis under load.
- Proposed fix: request logger middleware, structured log format, and trace/correlation ID propagation.
- Effort: Medium
- Risk: Low

## 3) Frontend Architecture Audit

### Findings (ordered by severity)

#### High
1. **Pool details computes occupancy from partial leaderboard page**
- Evidence: participant count is derived from `leaderboard.length` while request is paginated with limit 50 (`frontend/src/pages/PoolDetailsPage.jsx:54-56`, `78`, `356-357`).
- Impact: pool fullness, occupancy UI, and join gating can be incorrect when participants > 50.
- Proposed fix: use backend `pool.participantCount` or leaderboard pagination `total` as source of truth.
- Effort: Low
- Risk: Low

2. **Auth state is token-presence based, not user-presence based**
- Evidence: `isAuthenticated: Boolean(token)` (`frontend/src/AuthContext.jsx:93`) while optional-auth endpoints may treat invalid token as anonymous.
- Impact: temporary auth state mismatch and UX confusion.
- Proposed fix: expose derived auth status with explicit states (`anonymous`, `authenticated`, `stale_token`) and normalize handling in API layer.
- Effort: Medium
- Risk: Medium

#### Medium
3. **Route alias proliferation increases contract drift risk**
- Evidence: multiple aliases for same resources (`/duel-details/:id` and `/duels/:duelId`; `/pool-details/:id`, `/pools/:poolId`, `/pool/:poolId`) in `frontend/src/App.jsx:28-33`.
- Impact: fragmented deep-link semantics and longer-term maintenance burden.
- Proposed fix: canonicalize one route per resource with backward-compat redirects only where required.
- Effort: Low
- Risk: Low

4. **Page components mix heavy domain logic and UI composition**
- Evidence: stateful API workflows, derived domain logic, and large presentation trees in single files (notably pool and duel pages).
- Impact: testing and reuse friction; higher defect probability during UI changes.
- Proposed fix: extract feature hooks (`usePoolDetails`, `useDuelsLobby`) and presentational components.
- Effort: Medium
- Risk: Low

5. **API contracts are implicit and untyped across boundaries**
- Evidence: response shapes are consumed directly with defensive optional access (`data?.x`) across pages.
- Impact: hidden contract drift until runtime.
- Proposed fix: add shared DTO validators/types (at least frontend runtime validation layer per endpoint).
- Effort: Medium
- Risk: Medium

#### Low
6. **Public/private state handling in pages is inconsistent**
- Evidence: some flows redirect unauthenticated users before API call; others rely on backend error handling.
- Impact: inconsistent UX and error messaging.
- Proposed fix: standardize guard strategy through shared helpers and route-level conventions.
- Effort: Low
- Risk: Low

## 4) Cross-Stack Contract Audit

### Contract drift observations
- Error responses are mostly `{ message, errors? }`, but no explicit machine-readable `code` field.
- Pagination shape is mostly consistent (`page`, `limit`, `total`, `totalPages`) across modules, which is good.
- Auth-required vs optional-auth semantics differ in strictness and token-invalid behavior.
- Resource route naming differs between canonical and legacy alias paths in frontend.

### API/interface normalization matrix (current -> target)

| Area | Current | Target |
|---|---|---|
| Error envelope | `{ message, errors? }` with ad hoc status mapping | `{ error: { code, message, details?, requestId? } }` with centralized mapper |
| Pagination | Common shape but handled ad hoc in pages | Keep same shape and enforce shared pagination parser/hook |
| Auth-required endpoints | Strict 401 behavior via `authMiddleware` | Keep strict behavior; add shared error code contract for auth failures |
| Optional-auth endpoints | Invalid token silently ignored and treated anonymous | Preserve public access but emit explicit auth-context signal for clients |
| Resource DTO naming | Mixed route params (`id`, `poolId`, `duelId`) and aliases | Canonical per-resource route (`/pools/:poolId`, `/duels/:duelId`) with transitional redirects |

## 5) Verification Scenarios (Audit-only)

1. Unauthorized/optional-auth access paths
- Verify missing token on public pools/leaderboard succeeds.
- Verify invalid token on optional-auth endpoints does not crash and clearly maps to expected client behavior.

2. Invite-code flows
- Verify conflict handling on duplicate preferred invite code.
- Verify concurrent duel joins return exactly one success and one conflict.
- Verify pool join near capacity behaves correctly under concurrent requests.

3. Pagination/filter contract consistency
- Compare `pools`, `duels`, and `leaderboard` pagination envelopes and page-boundary behavior.

4. Auth bootstrap/token expiry behavior
- Simulate stale token in local storage and confirm AuthContext and API-layer behavior remains coherent.

5. Deep-link and alias behavior
- Validate canonical route loads and alias redirects for pool/duel detail pages.

## 6) Prioritized Roadmap

### Now (correctness + consistency cleanup)
1. Fix participant-count source in pool details UI (use backend total/participantCount, not leaderboard page length).
2. Introduce a global backend error middleware and shared error codes without changing endpoint semantics.
3. Consolidate env usage in backend bootstrap through validated `env` config only.
4. Canonicalize frontend resource routes and retain minimal redirects for backward compatibility.

### Next (architecture hardening)
1. Add shared backend domain utilities (invite code generation/normalization, common response mappers).
2. Extract frontend feature hooks from large page components to isolate domain logic from presentation.
3. Add runtime API response validation on frontend for critical endpoints.
4. Add request-scoped logging with correlation IDs.

### Later (scale readiness)
1. Redesign leaderboard to DB-level or pre-aggregated ranking pipeline.
2. Introduce wallet ledger + atomic financial transaction boundaries before enforcing paid-entry operations.
3. Add test pyramid:
   - backend service + API integration tests for join/authorization flows
   - frontend integration tests for auth bootstrap and detail-page occupancy behavior

## 7) Test Coverage and Quality Gaps

- No automated tests were found in `backend/` or `frontend/`.
- High-value first tests:
  1. Duel join race contention
  2. Pool capacity contention
  3. Optional-auth invalid token behavior
  4. Pool details occupancy correctness when participant count > page size

## 8) Assumptions

- Docker/deployment concerns are intentionally excluded.
- Recommendations are audit-first and avoid immediate production API shape changes where possible.
- Full-stack coverage is balanced; backend and frontend were analyzed with equal priority.
