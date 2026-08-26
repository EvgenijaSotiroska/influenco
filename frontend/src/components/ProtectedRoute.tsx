import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";
import type { UserRole } from "../api/types/auth.ts";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole?: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}