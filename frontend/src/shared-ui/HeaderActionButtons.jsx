// src/components/customer/CustomerActions.jsx
import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function HeaderActionsButtons({ selectedCount, onDeleteMultiple, onOpenCreate, loading }) {
  return (
    <div className="flex justify-end items-center gap-3 mb-6">
      <button
        onClick={onOpenCreate}
        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        type="button"
        aria-label="Create customer"
        disabled={loading}
      >
        <FaPlus />
        <span className="hidden s+m:inline">Create </span>
      </button>

      <button
        onClick={onDeleteMultiple}
        disabled={selectedCount === 0 || loading}
        className={`flex items-center gap-2 px-5 py-2 rounded-md text-white shadow-sm transition ${
          selectedCount === 0 || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        }`}
        type="button"
        aria-label={`Delete selected rows (${selectedCount})`}
      >
        <FaTrash />
        <span>
          Delete Selected {selectedCount > 0 && <span>({selectedCount})</span>}
        </span>
      </button>
    </div>
  );
}
