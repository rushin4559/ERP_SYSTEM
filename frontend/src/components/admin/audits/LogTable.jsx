import React, { useState, useEffect } from "react";
import useLogsData from "./useLogsData";
import LogFilters from "./LogFilters";
import LogTableDesktop from "./LogTableDesktop";
import LogCardList from "./LogCardList";
import LogPagination from "./LogPagination";

export default function LogTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    service: "",
    from: "",
    to: "",
    sort: "created_at:desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, total, loading, error } = useLogsData({
    page,
    limit,
    ...filters,
  });

  // 👉 Detect window width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header / Metadata */}
      <div className="bg-gray-100 rounded-md p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-sm">
        {/* Left section */}
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Total Logs:</span> {total} |{" "}
          <span className="font-semibold">Page:</span> {page} / {Math.ceil(total / limit)} |{" "}
          <span className="font-semibold">Limit:</span> {limit}
        </div>

        {/* Right section */}
        <div className="text-sm text-gray-500 sm:text-right">
          Showing <span className="font-medium">{data.length}</span> logs
        </div>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition 
    ${showFilters
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"} 
    shadow-sm
  `}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && <LogFilters filters={filters} onChange={(newFilters) => {
        setPage(1);
        setFilters((prev) => ({ ...prev, ...newFilters }));
      }} />}

      <div className="overflow-x-auto">
        {loading && <div className="text-center py-6">Loading logs...</div>}
        {error && <div className="text-center text-red-600 py-6">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-6">No logs found.</div>
        )}

        {/* 👉 Only mount one of them */}
        {isDesktop ? (
          <LogTableDesktop
            logs={data}
            sort={filters.sort}
            onSort={setFilters}
          />
        ) : (
          <LogCardList data={data} />
        )}
      </div>

      {!loading && total > 0 && (
        <LogPagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
