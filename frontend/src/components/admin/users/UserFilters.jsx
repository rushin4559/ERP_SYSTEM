import React from "react";

export default function UserFilters({ filters, onChange }) {
  return (
    <>
      {/* Text Inputs and Role Select in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={filters.username}
            onChange={onChange}
            placeholder="Search by username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        {/* Role Select */}
        <div>
          <label htmlFor="role" className="block text-sm font-semibold mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Date Range Inputs in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-sans text-gray-800">
        {/* Created At Min */}
        <div>
          <label htmlFor="created_at_min" className="block text-sm font-semibold mb-1 text-gray-700">
            Created At (Min)
          </label>
          <input
            type="date"
            id="created_at_min"
            name="created_at_min"
            value={filters.created_at_min}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>
        {/* Created At Max */}
        <div>
          <label htmlFor="created_at_max" className="block text-sm font-semibold mb-1 text-gray-700">
            Created At (Max)
          </label>
          <input
            type="date"
            id="created_at_max"
            name="created_at_max"
            value={filters.created_at_max}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>
        {/* You can similarly add Updated At min/max if needed */}
      </div>
    </>
  );
}
