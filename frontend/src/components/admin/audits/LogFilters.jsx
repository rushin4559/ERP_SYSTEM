import React from "react";

export default function LogFilters({ filters, onChange }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={onChange}
            placeholder="Search logs by username..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        <div>
          <label
            htmlFor="from"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            From
          </label>
          <input
            type="date"
            id="from"
            name="from"
            value={filters.from}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition font-sans text-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="to"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            To
          </label>
          <input
            type="date"
            id="to"
            name="to"
            value={filters.to}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition font-sans text-gray-800"
          />
        </div>
      </div>
    </>
  );
}
