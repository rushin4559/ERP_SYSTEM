// src/components/customer/CustomerPagination.jsx
import React from "react";

export default function Pagination({ page, totalPages, limit, setPage, setLimit }) {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(totalPages);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  if (totalPages === 0) return null;

  const buttonClasses =
    "px-3 py-1 min-w-[2.5rem] border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-3 sm:space-y-0">
      {/* Rows per page */}
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <label htmlFor="rowsPerPage" className="whitespace-nowrap">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={limit}
          onChange={handleLimitChange}
          className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-2 text-gray-700 text-sm font-medium select-none">
        <button
          onClick={handleFirst}
          disabled={page === 1}
          className={buttonClasses}
          aria-label="Go to first page"
          type="button"
        >
          {"<<"}
        </button>
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={buttonClasses}
          aria-label="Go to previous page"
          type="button"
        >
          {"<"}
        </button>

        <span className="mx-2 min-w-[8rem] text-center">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={buttonClasses}
          aria-label="Go to next page"
          type="button"
        >
          {">"}
        </button>
        <button
          onClick={handleLast}
          disabled={page === totalPages}
          className={buttonClasses}
          aria-label="Go to last page"
          type="button"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
