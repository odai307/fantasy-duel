import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateDuelPage from './pages/CreateDuelPage';
import DuelDetailsPage from './pages/DuelDetailsPage';
import DuelsPage from './pages/DuelsPage';
import PoolDetailsPage from './pages/PoolDetailsPage';
import PoolsListPage from './pages/PoolsListPage';
import CreatePoolPage from './pages/CreatePoolPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

/**
 * Legacy redirects for backward compatibility.
 * Old duels aliases: /duel-details/:id, /duel-details, /join-duel
 * → Canonical: /duels/:duelId, /duels, /duels/create
 */
function LegacyDuelRedirect() {
  const { id } = useParams();
  return <Navigate replace to={id ? `/duels/${id}` : '/duels'} />;
}

/**
 * Legacy redirects for backward compatibility.
 * Old pools aliases: /pool-details/:id, /pool/:poolId, /pool-details
 * → Canonical: /pools/:poolId, /pools, /pools/create
 */
function LegacyPoolRedirect() {
  const { id, poolId } = useParams();
  const resolvedPoolId = poolId || id;
  return <Navigate replace to={resolvedPoolId ? `/pools/${resolvedPoolId}` : '/pools'} />;
}

export default function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* Public Pages */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/pools" element={<PoolsListPage />} />

      {/* Protected Pages */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Duels Routes (Canonical) */}
      <Route path="/duels" element={<ProtectedRoute><DuelsPage /></ProtectedRoute>} />
      <Route path="/duels/create" element={<ProtectedRoute><CreateDuelPage /></ProtectedRoute>} />
      <Route path="/duels/:duelId" element={<ProtectedRoute><DuelDetailsPage /></ProtectedRoute>} />

      {/* Pools Routes (Canonical) */}
      <Route path="/pools/create" element={<ProtectedRoute><CreatePoolPage /></ProtectedRoute>} />
      <Route path="/pools/:poolId" element={<ProtectedRoute><PoolDetailsPage /></ProtectedRoute>} />

      {/* Legacy Backward-Compat Redirects */}
      <Route path="/duel-details" element={<Navigate to="/duels" replace />} />
      <Route path="/duel-details/:id" element={<LegacyDuelRedirect />} />
      <Route path="/join-duel" element={<Navigate to="/duels" replace />} />
      <Route path="/create-duel" element={<Navigate to="/duels/create" replace />} />

      <Route path="/pool-details" element={<Navigate to="/pools" replace />} />
      <Route path="/pool-details/:id" element={<LegacyPoolRedirect />} />
      <Route path="/pool/:poolId" element={<LegacyPoolRedirect />} />
      <Route path="/create-pool" element={<Navigate to="/pools/create" replace />} />
      <Route path="/pools-list" element={<Navigate to="/pools" replace />} />

      {/* 404 */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

