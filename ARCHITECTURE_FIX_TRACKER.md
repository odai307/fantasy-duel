# FantasyDuel Architecture Fix Tracker

Last updated: 2026-05-02
Scope: Docker excluded

## Status legend
- `DONE`: implemented and verified in code
- `IN_PROGRESS`: currently being implemented
- `PENDING`: not started yet

## Prioritized fixes

| # | Problem | Priority | Status | Notes |
|---|---|---|---|---|
| 1 | Pool participant/fullness uses partial leaderboard page in details UI | High | DONE | Fixed in `frontend/src/pages/PoolDetailsPage.jsx` using backend participant totals and refresh-after-join. |
| 2 | Auth state mismatch (`token` presence vs verified user session) | High | DONE | `AuthContext` now derives `authStatus` and `isAuthenticated` from verified user session, not token presence only. |
| 3 | Pool join race-safety parity with duel join | High | DONE | Pool join now locks pool row (`FOR UPDATE`) and enforces capacity/status checks inside the same transaction before participant insert. |
| 4 | Duplicate backend error handling and missing centralized error taxonomy | Medium | DONE | Added shared `AppError` taxonomy, global error middleware, async controller wrapper, and normalized error envelope with stable codes. |
| 5 | Split backend env source of truth | Medium | DONE | Moved dotenv bootstrap into `shared/config/env.js` and routed app/bootstrap + Prisma runtime env reads through validated `env`. |
| 6 | Route alias proliferation for resource details | Medium | DONE | Canonicalized detail routes to `/duels/:duelId` and `/pools/:poolId`; legacy detail aliases now redirect to canonical paths. |
| 7 | Large frontend page components mixing domain logic and presentation | Medium | DONE | Extracted feature hooks: `usePoolDetails` and `useDuelsLobby`, moving API/state/join workflows out of large page components. |
| 8 | No runtime API response contract validation on frontend | Medium | DONE | Added runtime API validators (`apiValidators.js`) and wired critical endpoint responses through DTO checks in auth/pool/duel/leaderboard API modules. |
| 9 | Missing request-level observability baseline | Medium | DONE | Added request context (`x-request-id` propagation), structured request logging with latency/status, and request ID in error responses for correlation. |
| 10 | Leaderboard scalability + wallet transaction boundaries + test pyramid | Lower immediate / strategic | PENDING | Scale/perf and domain-completeness phase. |

## Change log
- 2026-05-02: Tracker created.
- 2026-05-02: Fix #1 marked `DONE`.
- 2026-05-02: Fix #2 marked `DONE`.
- 2026-05-02: Fix #3 marked `DONE`.
- 2026-05-02: Fix #4 marked `DONE`.
- 2026-05-02: Fix #5 marked `DONE`.
- 2026-05-02: Fix #6 marked `DONE`.
- 2026-05-02: Fix #7 marked `DONE`.
- 2026-05-02: Fix #8 marked `DONE`.
- 2026-05-02: Fix #9 marked `DONE`.
