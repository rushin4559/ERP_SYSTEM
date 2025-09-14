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
        try {
            logout(); // clears localStorage and context
        } catch (e) {
            console.error(e);
        }
        toast.success("Logged out — बघ पुन्हा भेटूया! 👋");
        navigate("/login", { replace: true });
        // small delay then reload to ensure all in-memory caches are cleared
        setTimeout(() => window.location.reload(), 80);
    };

    const userInitial = user?.username?.[0]?.toUpperCase() || "U";

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link to="/home" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                                {userInitial}
                            </div>
                            <span className="hidden sm:inline font-semibold text-gray-800">MyApp</span>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden sm:flex items-center gap-4">
                        {/* <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-gray-900"
                            }
                        >
                            Home
                        </NavLink> */}

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
                                isActive ? "text-blue-600 font-medium flex items-center gap-2" : "text-gray-700 hover:text-gray-900 flex items-center gap-2"
                            }
                        >
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">{userInitial}</div>
                            <span className="hidden md:inline">{user?.username || "Profile"}</span>
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="ml-2 px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
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
                                /* close icon */
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                /* hamburger */
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
                    {/* <Link to="/home" onClick={() => setOpen(false)} className="py-2 text-gray-700 hover:bg-gray-50 rounded-md">Home</Link> */}

                    {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-gray-700 hover:bg-gray-50 rounded-md">Admin</Link>
                    )}

                    <Link to="/profile"
                        onClick={() => setOpen(false)}
                        className="py-2 rounded-md text-blue-600 font-medium flex text-gray-700 flex items-center gap-2"
                    >
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">{userInitial}</div>
                        <span>{user?.username || "Profile"}</span>
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
