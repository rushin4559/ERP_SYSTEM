// src/components/customer/CustomerForm/FormInput.jsx
import React from "react";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  maxLength,
  rows,
}) {
  if (type === "textarea") {
    return (
      <div>
        {label && (
          <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={rows || 3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  }

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
