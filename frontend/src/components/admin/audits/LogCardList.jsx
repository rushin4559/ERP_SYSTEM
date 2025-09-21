import React from "react";

export default function LogCardList({ data }) {
  console.log("Rendering mobile log card list");

  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-gray-500">No logs found.</div>;
  }

  // Determine badge and border color based on status code
  const getStatusClasses = (status) => {
    const s = Number(status); // ensure it's a number

    if (!s) return { bg: "bg-gray-100 text-gray-700", border: "border-gray-300" };

    if (s >= 200 && s < 300) return { bg: "bg-green-50 text-green-700", border: "border-green-500" };
    if (s >= 400 && s < 500) return { bg: "bg-yellow-50 text-yellow-700", border: "border-yellow-500" };
    if (s >= 500) return { bg: "bg-red-50 text-red-700", border: "border-red-500" };

    return { bg: "bg-gray-100 text-gray-700", border: "border-gray-300" };
  };

  return (
    <div className="space-y-4">
      {data.map((log) => {
        const statusText = log.status ? log.status.toString() : "—";
        const { bg, border } = getStatusClasses(log.status);

        return (
          <div
            key={log.id}
            className={`bg-white border-l-4 ${border} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Top row: User & Status */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{log.username || "—"}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg}`}>
                {statusText}
              </span>
            </div>

            {/* Action */}
            <div className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Action:</span> {log.action || "—"}
            </div>

            {/* Service */}
            <div className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Service:</span> {log.service || "—"}
            </div>

            {/* Timestamp */}
            <div className="text-gray-500 text-xs">
              {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
