import React from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import NavLinkItem from "./NavLinkItem";
import UserMenu from "./UserMenu";

export default function DesktopNav({
  adminRef,
  masterRef,
  adminDropdown,
  masterDropdown,
  setAdminDropdown,
  setMasterDropdown,
  user,
}) {
  return (
    <nav className="hidden sm:flex items-center gap-6 relative">
      <NavLinkItem to="/home">Home</NavLinkItem>

      {/* Master dropdown */}
      <div
        ref={masterRef}
        className="relative"
        onMouseEnter={() => setMasterDropdown(true)}
        onMouseLeave={() => setMasterDropdown(false)}
      >
        <button
          className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition ${
            masterDropdown
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
          }`}
          type="button"
          aria-haspopup="true"
          aria-expanded={masterDropdown}
        >
          Master
        </button>
        <DropdownMenu isOpen={masterDropdown}>
          <Link
            to="/customers"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Customers
          </Link>
          {/* Add more links here later */}
        </DropdownMenu>
      </div>

      {/* Admin dropdown */}
      {user?.role === "admin" && (
        <div
          ref={adminRef}
          className="relative"
          onMouseEnter={() => setAdminDropdown(true)}
          onMouseLeave={() => setAdminDropdown(false)}
        >
          <button
            className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition ${
              adminDropdown
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
            }`}
            type="button"
            aria-haspopup="true"
            aria-expanded={adminDropdown}
          >
            Admin
          </button>
          <DropdownMenu isOpen={adminDropdown}>
            <Link
              to="/admin/users"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Users
            </Link>
            <Link
              to="/admin/logs"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logs
            </Link>
          </DropdownMenu>
        </div>
      )}

      <UserMenu />
    </nav>
  );
}
