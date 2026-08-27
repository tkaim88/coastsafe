import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route element and redirects to /login if there's no
 * authenticated user. Keeps the "is this page allowed?" check in one
 * place instead of repeated inside every page component that needs auth.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Remember where the user was headed so Login can send them back
    // after a successful sign-in, instead of always landing on Home.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
