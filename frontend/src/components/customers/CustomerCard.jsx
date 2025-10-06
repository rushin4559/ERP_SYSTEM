// src/components/customer/CustomerCard.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function CustomerCard({ customer, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={`shadow-md rounded-lg p-4 bg-white ${
        isSelected ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{customer.customer_name}</h3>
          <p className="text-sm text-gray-600">
            {customer.state_name || "State N/A"} - {customer.phone_no || "Phone N/A"}
          </p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(customer.id)}
          aria-label={`Select customer ${customer.customer_name}`}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => onEdit(customer)}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Edit ${customer.customer_name}`}
          type="button"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${customer.customer_name}?`)) {
              onDelete(customer.id);
            }
          }}
          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete ${customer.customer_name}`}
          type="button"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
}
