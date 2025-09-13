import { Outlet, Navigate } from "react-router";

export function login() {
    
}

export default function ProtectedRoutes() {
    const user = null;
    return user ? <Outlet /> : <Navigate to="/login" />
}
