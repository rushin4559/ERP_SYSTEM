import React from "react";

export default function DropdownMenu({ isOpen, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-20 ${className}`}
    >
      {children}
    </div>
  );
}
