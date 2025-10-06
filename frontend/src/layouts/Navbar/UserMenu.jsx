import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error(e);
    }
    toast.success("Logged out — बघ पुन्हा भेटूया! 👋");
    navigate("/login", { replace: true });
    setTimeout(() => window.location.reload(), 80);
  };

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
    }`;

  return (
    <>
      <NavLink to="/profile" className={linkClasses}>
        Profile
      </NavLink>
      <button
        onClick={handleLogout}
        className="ml-6 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
      >
        Logout
      </button>
    </>
  );
}
