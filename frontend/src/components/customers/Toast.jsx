// src/components/customer/Toast.jsx
import React, { useEffect } from "react";

export default function Toast({ id, message, type = "info", onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-600",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`mb-2 px-4 py-2 rounded shadow text-white max-w-sm break-words ${typeStyles[type] || typeStyles.info}`}
      role="alert"
    >
      {message}
    </div>
  );
}
