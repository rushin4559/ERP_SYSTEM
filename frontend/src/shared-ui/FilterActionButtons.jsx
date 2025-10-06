// src/components/customer/CustomerFilters/ActionButtons.jsx
import React from "react";
import { FaUndo, FaFilter, FaFileExport } from "react-icons/fa";

export default function FilterActionButtons({ onReset, onApply, onExport }) {
  const buttonBase =
    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition focus:outline-none focus:ring-2";

  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={onReset}
        className={`${buttonBase} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400`}
        aria-label="Reset Filters"
        title="Reset Filters"
      >
        <FaUndo />
        Reset
      </button>
      <button
        type="button"
        onClick={onApply}
        className={`${buttonBase} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`}
        aria-label="Apply Filters"
        title="Apply Filters"
      >
        <FaFilter />
        Apply
      </button>
      <button
        type="button"
        onClick={onExport}
        className={`${buttonBase} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}
        aria-label="Export CSV"
        title="Export CSV"
      >
        <FaFileExport />
        Export
      </button>
    </div>
  );
}
