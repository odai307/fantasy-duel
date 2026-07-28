# FantasyDuel GH ⚽💳

**FantasyDuel GH** is a full-stack, peer-to-peer real-money wagering and gaming platform designed for **Fantasy Premier League (FPL)** managers in Ghana. 

Managers can connect their official FPL team, deposit funds using Ghanaian Mobile Money (MTN MoMo, Telecel Cash, AT Money) or Cards via **Paystack**, compete in 1v1 Head-to-Head Duels or Multi-Manager Pools, track live Gameweek points, and request instant cash payouts to their MoMo or bank accounts.

---

## 🚀 Key Features

### 1. 💳 Paystack Real Payment & Wallet Engine
- **Mobile Money & Card Checkout**: Seamless deposit integration for **MTN MoMo**, **Telecel Cash**, **AT Money**, and **Bank Cards** via Paystack API starting at GH₵ 1.00.
- **Dynamic Callback & Verification**: Instant reference verification with automated query string cleanup and live wallet balance re-sync.
- **Payout & Cash Withdrawal Engine**: Withdrawal request flow to Mobile Money or Bank accounts with available balance validation guards.
- **Paginated Ledger**: High-performance 15-item batch loading for user financial activity history.

### 2. 🛡️ ACID-Compliant Wallet & Refund System
- **Entry Fee Guard**: Enforces strict balance validation before allowing users to create or join paid Duels or Pools.
- **Atomic Database Transactions (`$transaction`)**: Ensures zero-loss fee deductions and instant database state integrity.
- **Creator Cancellation & Instant Refund**: Open 1v1 duels can be cancelled by the creator prior to an opponent joining, automatically refunding 100% of the entry fee back to their wallet.

### 3. ⚽ Official Fantasy Premier League (FPL) Sync
- **Automated Gameweek Engine**: Dynamically detects current active Gameweeks (`is_current`), upcoming deadlines (`is_next`), and completed fixtures across all 38 Premier League events.
- **Pre-Season Support**: Handles pre-season locks gracefully and renders squad lineups.
- **Live Points Sync**: Fetches real-time Gameweek scores and manager information directly from the official FPL API.

### 4. ⚔️ Head-to-Head Duels & Private/Public Pools
- **1v1 Duels**: Create or join duels by unique 6-character invite codes.
- **Multi-Manager Pools**: Create public or private pools with optional participant limits and custom entry fees.
- **Live Leaderboards**: Ranked leaderboards with tie-breaking logic based on total and Gameweek points.

### 5. 👤 Profile & Account Management
- **Split First Name & Last Name**: Normalized user entity structure.
- **Interactive Edit Name Modal**: Allows users to update their manager details live.
- **Sidebar & Header Controls**: Navigation sidebar with user avatar card and 1-click Logout button.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, React Router, Material Symbols |
| **Backend** | Node.js, Express.js |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Payment Gateway** | Paystack REST API (MoMo & Card) |
| **FPL API Integration** | Premier League Bootstrap & Event API |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |

---

## 📁 Project Structure

```text
fantasy-duel/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database Models (User, Duel, Pool, Transaction)
│   ├── src/
│   │   ├── auth/                # Auth Controller, Service, & Routes
│   │   ├── wallet/              # Paystack Service & Wallet Payout Routes
│   │   ├── duels/               # 1v1 Duel Logic & Cancellation Engine
│   │   ├── pools/               # Multi-Manager Pool Logic & Leaderboards
│   │   ├── fpl/                 # FPL API Wrapper & Gameweek Resolver
│   │   ├── shared/              # Database Client, Errors, & Middleware
│   │   └── index.js             # Express App & Server Entry Point
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios & Fetch API Client Modules
│   │   ├── components/          # DepositModal, WithdrawalModal, Sidebar, FplModal
│   │   ├── context/             # AuthContext (Me, Login, Register, Wallet Refresh)
│   │   ├── pages/               # Dashboard, Duels, Pools, Wallet, Profile
│   │   └── main.jsx             # React Entrypoint & Router Configuration
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database installed and running locally.

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/fantasyduel?schema=public
JWT_SECRET=your_super_secret_jwt_key
PAYSTACK_SECRET_KEY=sk_test_2e5f70afb78c048c431b7c2eb06a24fbc81019b7
PAYSTACK_WEBHOOK_SECRET=sk_test_2e5f70afb78c048c431b7c2eb06a24fbc81019b7
```

Push database schema migrations to PostgreSQL:

```bash
npx prisma db push
```

Start the backend development server:

```bash
npm run dev
```

Base URL: `http://localhost:3000`

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PAYSTACK_PUBLIC_KEY=pk_test_ed28bfd86569538d376d375d38e375d51ef77737
```

Start the frontend development server:

```bash
npm run dev
```

Frontend App URL: `http://localhost:5173` (or `http://localhost:5174`)

---

## 📡 Core API Endpoints

### Auth & User Profile
- `POST /api/auth/register` - Create new manager account.
- `POST /api/auth/login` - Authenticate manager & return JWT token.
- `GET /api/auth/me` - Fetch authenticated user profile & balance.
- `PUT /api/auth/profile` - Update First Name & Last Name.

### Paystack Wallet & Transactions
- `POST /api/wallet/deposit/initialize` - Initialize Paystack deposit link.
- `GET /api/wallet/deposit/verify?reference=...` - Verify deposit & credit balance.
- `POST /api/wallet/withdraw` - Request MoMo / Bank payout.
- `GET /api/wallet/transactions?page=1&limit=15` - Fetch paginated transaction history.

### Duels & Pools
- `POST /api/duels` - Create 1v1 duel & deduct entry fee.
- `POST /api/duels/join-by-code` - Join duel using invite code.
- `POST /api/duels/:id/cancel` - Cancel open duel & get instant wallet refund.
- `POST /api/pools` - Create multi-manager pool.
- `POST /api/pools/:id/join` - Join public or private pool.

---

## 📄 License

Distributed under the MIT License.
