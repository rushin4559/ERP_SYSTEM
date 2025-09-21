import React from "react";

export default function LogTableDesktop({ logs, sort, onSort }) {
  console.log("Rendering desktop log table");

  const handleSort = (col) => {
    let dir = "desc";
    if (sort.startsWith(col)) {
      dir = sort.endsWith("desc") ? "asc" : "desc";
    }
    onSort(`${col}:${dir}`);
  };

  const SortIcon = ({ col }) => {
    if (!sort.startsWith(col))
      return <span className="ml-1 text-gray-400">⇅</span>;
    return sort.endsWith("asc") ? (
      <span className="ml-1 text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-blue-600">↓</span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
          <tr>
            <th
              className="px-4 py-3 cursor-pointer font-semibold"
              onClick={() => handleSort("created_at")}
            >
              Date <SortIcon col="created_at" />
            </th>
            <th
              className="px-4 py-3 cursor-pointer font-semibold"
              onClick={() => handleSort("username")}
            >
              User <SortIcon col="username" />
            </th>
            <th
              className="px-4 py-3 cursor-pointer font-semibold"
              onClick={() => handleSort("action")}
            >
              Action <SortIcon col="action" />
            </th>
            <th
              className="px-4 py-3 cursor-pointer font-semibold"
              onClick={() => handleSort("service")}
            >
              Service <SortIcon col="service" />
            </th>
            <th
              className="px-4 py-3 cursor-pointer font-semibold"
              onClick={() => handleSort("status")}
            >
              Status <SortIcon col="status" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {logs?.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center py-8 text-gray-500 text-sm"
              >
                No logs found
              </td>
            </tr>
          ) : (
            logs?.map((log, idx) => (
              <tr
                key={log.id}
                className={`hover:bg-gray-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                }`}
              >
                {/* Date */}
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {new Date(log.created_at).toLocaleString()}
                </td>

                {/* Username */}
                <td className="px-4 py-3 text-gray-700">
                  {log.username || "—"}
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-gray-700">{log.action}</td>

                {/* Service */}
                <td className="px-4 py-3 text-gray-700">{log.service}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      log.status === "success"
                        ? "bg-green-100 text-green-700"
                        : log.status === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
