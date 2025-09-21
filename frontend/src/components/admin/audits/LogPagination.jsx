import React from "react";

export default function LogPagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handlePageClick = (p) => {
    if (p !== page) onPageChange(p);
  };

  // Generate page numbers (simple version, could enhance with ellipsis later)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium border transition
          ${
            page === 1
              ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex gap-1 sm:gap-2">
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition
              ${
                p === page
                  ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium border transition
          ${
            page === totalPages
              ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
      >
        Next
      </button>
    </div>
  );
}
