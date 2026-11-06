import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loading, EmptyState } from "../components/ui/States";

// <ProtectedRoute>            any logged-in user
// <ProtectedRoute roles={["admin"]}>   only those roles
export default function ProtectedRoute({ children, roles }) {
  const { user, ready, role } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (roles && !roles.includes(role)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="You do not have access to this page" text="This area is for administrators." to="/" action="Go to the home page" />
      </div>
    );
  }
  return children;
}
