import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
    const token = localStorage.getItem("token");
    return (
        <Routes>

            {/* Root path redirect */}
            <Route
                path="/"
                element={
                    token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
                }
            />

            <Route path="/login" element={<Login />} />

            <Route
                path="/home" z
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <Admin />
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

            <Route path="*" element={<h1 className="text-center text-red-500">404 Not Found</h1>} />
        </Routes>
    );
}
