import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Customers from "../dashboards/Customers";
import Users from "../dashboards/Users";
import Logs from "../dashboards/Logs";

export default function AppRoutes() {
    const token = localStorage.getItem("token");
    return (
        <Routes>
            <Route path="/" element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/logs"
                element={
                    <AdminRoute>
                        <Logs />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <Users />
                    </AdminRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <Customers />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<h1 className="text-center text-red-500">404 Not Found</h1>} />
        </Routes>

    );
}
