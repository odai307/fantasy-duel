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

function LegacyDuelDetailsRedirect() {
  const { id } = useParams();
  return <Navigate replace to={id ? `/duels/${id}` : '/duels'} />;
}

function LegacyPoolDetailsRedirect() {
  const { id, poolId } = useParams();
  const resolvedPoolId = poolId || id;
  return <Navigate replace to={resolvedPoolId ? `/pools/${resolvedPoolId}` : '/pools'} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/create-duel" element={<ProtectedRoute><CreateDuelPage /></ProtectedRoute>} />
      <Route path="/duels" element={<ProtectedRoute><DuelsPage /></ProtectedRoute>} />
      <Route path="/join-duel" element={<Navigate to="/duels" replace />} />
      <Route path="/duel-details" element={<Navigate to="/duels" replace />} />
      <Route path="/duels/:duelId" element={<ProtectedRoute><DuelDetailsPage /></ProtectedRoute>} />
      <Route path="/duel-details/:id" element={<LegacyDuelDetailsRedirect />} />
      <Route path="/pool-details" element={<Navigate to="/pools" replace />} />
      <Route path="/pools/:poolId" element={<ProtectedRoute><PoolDetailsPage /></ProtectedRoute>} />
      <Route path="/pool-details/:id" element={<LegacyPoolDetailsRedirect />} />
      <Route path="/pool/:poolId" element={<LegacyPoolDetailsRedirect />} />
      <Route path="/pools" element={<PoolsListPage />} />
      <Route path="/pools-list" element={<Navigate to="/pools" replace />} />
      <Route path="/pools/create" element={<ProtectedRoute><CreatePoolPage /></ProtectedRoute>} />
      <Route path="/create-pool" element={<Navigate to="/pools/create" replace />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
