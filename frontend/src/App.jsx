import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateDuelPage from './pages/CreateDuelPage';
import JoinDuelPage from './pages/JoinDuelPage';
import DuelDetailsPage from './pages/DuelDetailsPage';
import PoolDetailsPage from './pages/PoolDetailsPage';
import PoolsListPage from './pages/PoolsListPage';
import CreatePoolPage from './pages/CreatePoolPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/create-duel" element={<ProtectedRoute><CreateDuelPage /></ProtectedRoute>} />
      <Route path="/join-duel" element={<ProtectedRoute><JoinDuelPage /></ProtectedRoute>} />
      <Route path="/duel-details" element={<ProtectedRoute><DuelDetailsPage /></ProtectedRoute>} />
      <Route path="/pool-details" element={<ProtectedRoute><PoolDetailsPage /></ProtectedRoute>} />
      <Route path="/pool-details/:id" element={<ProtectedRoute><PoolDetailsPage /></ProtectedRoute>} />
      <Route path="/pools-list" element={<PoolsListPage />} />
      <Route path="/create-pool" element={<ProtectedRoute><CreatePoolPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
