import React from "react";

export default function CustomerFilters({ filters, onChange }) {
  return (
    <>
      {/* Text Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="customer_name"
            className="block text-sm font-semibold mb-1"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={filters.customer_name}
            onChange={onChange}
            placeholder="Search by name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        <div>
          <label htmlFor="state_name" className="block text-sm font-semibold mb-1">
            State Name
          </label>
          <input
            type="text"
            id="state_name"
            name="state_name"
            value={filters.state_name}
            onChange={onChange}
            placeholder="Search by state"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 font-sans text-gray-800">
        {[
          { label: "Created At (Min)", name: "created_at_min" },
          { label: "Created At (Max)", name: "created_at_max" },
          { label: "Updated At (Min)", name: "updated_at_min" },
          { label: "Updated At (Max)", name: "updated_at_max" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-semibold mb-1 text-gray-700">
              {label}
            </label>
            <input
              type="date"
              id={name}
              name={name}
              value={filters[name]}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}
      </div>
    </>
  );
}
