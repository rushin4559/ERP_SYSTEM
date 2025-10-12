import useNavbarShortcuts from "../../hooks/useNavbarShortcuts";
import NavLinkItem from './NavLinkItem'
import DropdownMenu from "./DropdownMenu";
import { Link } from "react-router-dom";
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
  useNavbarShortcuts({
    masterDropdown,
    adminDropdown,
    setMasterDropdown,
    setAdminDropdown,
    user,
  });

  return (
    <nav className="hidden sm:flex items-center gap-6 relative font-sans text-base font-medium">
      <NavLinkItem to="/home">Home</NavLinkItem>

      {/* Master dropdown */}
      <div
        ref={masterRef}
        className="relative"
        onMouseEnter={() => setMasterDropdown(true)}
        onMouseLeave={() => setMasterDropdown(false)}
      >
        <button
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            masterDropdown
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
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
            className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
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
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              adminDropdown
                ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
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
              className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
            >
              Users
            </Link>
            <Link
              to="/admin/logs"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
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
