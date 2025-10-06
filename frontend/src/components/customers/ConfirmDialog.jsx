// src/components/customer/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">{title || "Are you sure?"}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            type="button"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
