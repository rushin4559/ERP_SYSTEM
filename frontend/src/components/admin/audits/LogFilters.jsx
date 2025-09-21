import React, { useState } from "react";
import { getLogs, exportLogs } from "../../../api/admin/logs";

export default function LogFilters({ filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => onChange(localFilters);

  const resetFilters = () => {
    const cleared = { username: "", status: "", from: "", to: "" };
    setLocalFilters(cleared);
    onChange(cleared);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const { total } = await getLogs({ ...localFilters, page: 1, limit: 1 });
      if (total === 0) {
        alert("No logs to export for the selected filters.");
        setLoading(false);
        return;
      }
      if (!window.confirm(`You are about to download ${total} logs. Continue?`)) {
        setLoading(false);
        return;
      }
      const blob = await exportLogs(localFilters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audit_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Username search */}
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={localFilters.username}
            onChange={handleChange}
            placeholder="Search by username..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
          <select
            name="status"
            value={localFilters.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">From</label>
          <input
            type="date"
            name="from"
            value={localFilters.from}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">To</label>
          <input
            type="date"
            name="to"
            value={localFilters.to}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 col-span-1 sm:col-span-2 lg:col-span-2">
          <button
            onClick={applyFilters}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Reset
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Generating..." : "Export CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
