
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ children }) {
    const { signed } = useAuth();
    return signed ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
    const { signed } = useAuth();
    return signed ? <Navigate to="/dashboard" replace /> : children;
}
