// src/components/customer/CustomerMetaHeader.jsx
import React from "react";

export default function MetaHeader({ total, pages, page, limit, showingCount }) {
  return (
    <div className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200 text-gray-700 text-sm">
      <div className="flex flex-wrap gap-6 font-medium">
        <div>
          Total <span className="font-semibold">{total}</span>
        </div>
        <div>
          Total Pages <span className="font-semibold">{pages}</span>
        </div>
        <div>
          Current Page <span className="font-semibold">{page}</span>
        </div>
        <div>
          Rows per Page <span className="font-semibold">{limit}</span>
        </div>
      </div>
      <div className="italic text-gray-500 mt-1 sm:mt-0">
        Showing {showingCount} row{showingCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
