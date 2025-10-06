import React from "react";
import { NavLink } from "react-router-dom";

export default function NavLinkItem({ to, children }) {
  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
    }`;

  return (
    <NavLink to={to} className={linkClasses}>
      {children}
    </NavLink>
  );
}
