import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Dropdown refs and state
  const adminRef = useRef(null);
  const masterRef = useRef(null);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [masterDropdown, setMasterDropdown] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
      if (masterRef.current && !masterRef.current.contains(event.target)) {
        setMasterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error(e);
    }
    toast.success("Logged out — बघ पुन्हा भेटूया! 👋");
    // Navigation and reload logic can be handled inside UserMenu's logout if preferred
    setTimeout(() => window.location.reload(), 80);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="text-2xl font-extrabold text-blue-600 tracking-tight select-none">ERP</div>
            <span className="hidden sm:inline font-semibold text-gray-800 text-lg select-none">Enterprise</span>
          </Link>

          {/* Desktop nav */}
          <DesktopNav
            adminRef={adminRef}
            masterRef={masterRef}
            adminDropdown={adminDropdown}
            masterDropdown={masterDropdown}
            setAdminDropdown={setAdminDropdown}
            setMasterDropdown={setMasterDropdown}
            user={user}
          >
            <UserMenu />
          </DesktopNav>

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

      {/* Mobile sliding panel */}
      <MobileMenu open={open} setOpen={setOpen} user={user} handleLogout={handleLogout} />
    </header>
  );
}
