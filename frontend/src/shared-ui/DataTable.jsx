import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  selectedIds = [],
  setSelectedIds,
  showActions = true,
  showCheckboxes = true,
  actions,
  onEdit,
  onDelete,
  rowKey = "id",
  noDataMessage = "No records found.",
}) {
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item[rowKey]));
    }
  };

  if (loading) {
    return <p className="p-4 text-center text-gray-500 font-sans">Loading...</p>;
  }

  if (data.length === 0) {
    return <p className="p-4 text-center text-gray-500 font-sans">{noDataMessage}</p>;
  }

  // Default actions renderer if showActions is enabled
  const defaultActions = (item) => (
    <>
      <button
        onClick={() => onEdit && onEdit(item)}
        className="p-2 text-blue-600 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-label={`Edit ${item[rowKey]}`}
        type="button"
      >
        <FaEdit size={16} />
      </button>
      <button
        onClick={() => {
          if (onDelete && window.confirm(`Are you sure you want to delete this item?`)) {
            onDelete(item[rowKey]);
          }
        }}
        className="p-2 text-red-600 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        aria-label={`Delete ${item[rowKey]}`}
        type="button"
      >
        <FaTrash size={16} />
      </button>
    </>
  );

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm font-sans text-gray-700">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {showCheckboxes && (
              <th className="p-3 border-b border-gray-300 text-center w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
            )}
            {columns.map(({ header, key, className = "" }) => (
              <th
                key={key}
                className={`p-3 border-b border-gray-300 text-left font-semibold text-gray-900 text-base ${className}`}
              >
                {header}
              </th>
            ))}
            {showActions && <th className="p-3 border-b border-gray-300 text-center w-28">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item[rowKey]} className="hover:bg-gray-50 border-t border-gray-200">
              {showCheckboxes && (
                <td className="p-3 text-center border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item[rowKey])}
                    onChange={() => handleSelect(item[rowKey])}
                    aria-label={`Select row ${item[rowKey]}`}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
              )}
              {columns.map(({ key, className = "" }) => (
                <td key={key} className={`p-3 border-b border-gray-200 text-sm text-gray-700 ${className}`}>
                  {/* Format dates if value is date string */}
                  {item[key] instanceof Date
                    ? item[key].toLocaleString()
                    : (typeof item[key] === "string" && /^\d{4}-\d{2}-\d{2}T/.test(item[key]))
                    ? new Date(item[key]).toLocaleString()
                    : item[key] ?? "-"}
                </td>
              ))}
              {showActions && (
                <td className="p-3 border-b border-gray-200 flex space-x-2 justify-center">
                  {actions ? actions(item) : defaultActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
