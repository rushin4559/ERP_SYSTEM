import React from "react";
import { Link } from "react-router-dom";
import MobileSubmenu from "./MobileSubmenu";

export default function MobileMenu({ open, setOpen, user, handleLogout }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="px-4 py-5 flex flex-col gap-4 text-gray-700">
        <Link
          to="/home"
          onClick={() => setOpen(false)}
          className="py-2 rounded-md hover:bg-gray-100 font-semibold tracking-wide"
        >
          Home
        </Link>

        {/* Master submenu toggle */}
        <MobileSubmenu title="Master" closeMenu={() => setOpen(false)}>
          <Link
            to="/customers"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Customers
          </Link>
          {/* Additional master links here */}
        </MobileSubmenu>

        {/* Admin submenu toggle */}
        {user?.role === "admin" && (
          <MobileSubmenu title="Admin" closeMenu={() => setOpen(false)}>
            <Link
              to="/admin/users"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Users
            </Link>
            <Link
              to="/admin/logs"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logs
            </Link>
          </MobileSubmenu>
        )}

        <Link
          to="/profile"
          onClick={() => setOpen(false)}
          className="py-2 rounded-md hover:bg-gray-100 font-semibold tracking-wide"
        >
          Profile
        </Link>

        <button
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
          className="py-2 text-red-600 hover:bg-red-50 rounded-md font-semibold tracking-wide text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
