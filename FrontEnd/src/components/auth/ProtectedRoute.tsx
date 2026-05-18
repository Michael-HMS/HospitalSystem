import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../../services/auth-service";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const role = AuthService.getRole();

    if (!role) {
        // Not logged in, redirect to auth
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but insufficient role, redirect to forbidden
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
