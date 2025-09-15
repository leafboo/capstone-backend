import { Outlet, Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function ProtectedRoutes() {

    const { isAuthenticated } = useContext(AuthContext)
   

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
