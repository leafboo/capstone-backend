import { Outlet, Navigate } from "react-router";

export default function ProtectedRoutes() {
    const user = null;
    return user ? <Outlet /> : <Navigate to="/login" />
}
