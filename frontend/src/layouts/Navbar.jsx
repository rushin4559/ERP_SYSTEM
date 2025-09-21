// src/components/layouts/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    try { logout(); } catch (e) { console.error(e); }
    toast.success("Logged out — बघ पुन्हा भेटूया! 👋");
    navigate("/login", { replace: true });
    setTimeout(() => window.location.reload(), 80);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="text-xl font-bold text-blue-600">ERP</div>
            <span className="hidden sm:inline font-semibold text-gray-800">Enterprise</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-4">
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-gray-900"
                }
              >
                Admin
              </NavLink>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`sm:hidden border-t bg-white ${open ? "block" : "hidden"}`}>
        <div className="px-4 py-3 flex flex-col gap-1">
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-gray-700 hover:bg-gray-50 rounded-md">Admin</Link>
          )}

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Profile
          </Link>

          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="text-left py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
