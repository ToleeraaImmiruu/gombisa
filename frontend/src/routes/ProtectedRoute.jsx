import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loading } from "../components/ui/States";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return children;
}
