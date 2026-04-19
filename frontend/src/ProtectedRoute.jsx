import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './authUtils';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate replace state={{ from: location.pathname }} to="/auth" />;
  }

  return children;
}
