import React, { useState } from "react";
import FilterActionButtons from "../shared-ui/FilterActionButtons";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function SharedFilter({ children, onApply, onReset, onExport }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-6">
      <button
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition inline-flex items-center"
        onClick={() => setShow((prev) => !prev)}
        type="button"
        aria-expanded={show}
        aria-controls="filter-panel"
        aria-label={show ? "Hide Filters" : "Show Filters"}
      >
        {show ? "Hide Filters" : "Show Filters"}
        {show ? (
          <HiChevronUp className="w-5 h-5 ml-2" aria-hidden="true" />
        ) : (
          <HiChevronDown className="w-5 h-5 ml-2" aria-hidden="true" />
        )}
      </button>

      {show && (
        <div
          id="filter-panel"
          className="mt-4 p-6 bg-white rounded-lg shadow-md space-y-6"
          role="region"
          aria-label="Filters"
        >
          {children}

          <FilterActionButtons onReset={onReset} onApply={onApply} onExport={onExport} />
        </div>
      )}
    </div>
  );
}
