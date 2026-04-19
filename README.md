# FantasyDuel GH

FantasyDuel GH is a fantasy football competition platform for Ghana-based users.  
Players can register, log in, join duels, create pools, and compete on leaderboards.

## Suggested Repository Names

If you want a strong GitHub repo name, these are solid options:

1. `fantasyduel-gh` (recommended)
2. `fantasyduel-ghana`
3. `fantasyduel-platform`
4. `fantasyduel-web`

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + bcryptjs
- Validation: Zod

## Project Structure

```text
fantasy-duel/
  backend/      # Express API + Prisma
  frontend/     # React app (Vite)
  design/       # HTML design references
  README.md
```

## Current Status

Implemented right now:

- Auth APIs: register, login, me
- Prisma models for `User` and `Pool`
- Pool enums: `PoolVisibility` and `PoolStatus`
- Protected route system on frontend
- Public route exceptions for `pools-list` and `leaderboard`
- Auth page wired to backend login/register APIs
- Create Pool UI:
  - creator + gameweek uniqueness check (frontend-side)
  - public/private visibility UI
  - optional invite code for private pool
  - no max participants mode
  - live preview updates

## Backend Setup

From `backend/`:

```bash
npm install
cp .env.example .env
```

Set your `.env` values (important keys):

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/fantasyduel
JWT_SECRET=change-me-in-production
```

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

Run backend:

```bash
npm run dev
```

API base URL: `http://localhost:3000`

## Frontend Setup

From `frontend/`:

```bash
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

App URL: `http://localhost:5173`

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)

Example login payload:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Routes (Frontend)

Public:

- `/landing`
- `/auth`
- `/pools-list`
- `/leaderboard`
- `/not-found`

Protected:

- `/dashboard`
- `/create-duel`
- `/join-duel`
- `/duel-details`
- `/pool-details`
- `/create-pool`
- `/wallet`
- `/profile`

## Architecture Notes

See:

- `FantasyDuel_GH_Architecture.docx`
- `design/` for UI reference pages used to build React views

## Next Milestones

- Connect pool creation UI to backend pool API
- Add duel and leaderboard backend modules
- Add wallet transactions and payment integration
- Add tests (API + UI flows)
- Add CI and deployment pipeline
