import React, { useState } from "react";

export default function MobileSubmenu({ title, children, closeMenu }) {
  const [openSub, setOpenSub] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenSub(!openSub)}
        className="w-full flex justify-between items-center py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
      >
        {title}
        <svg
          className={`w-4 h-4 transform transition-transform ${
            openSub ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {openSub && <div className="pl-4 border-l border-gray-300">{children}</div>}
    </div>
  );
}
