// src/pages/AdminPage.jsx
import React, { Suspense, lazy, useState } from "react";
import { toast } from "react-toastify";

// Lazy load dashboards
const UsersDashboard = lazy(() => import("../components/admin/Users/UserTable"));
const LogsDashboard = lazy(() => import("../components/admin/audits/LogTable"));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { key: "users", label: "Users" },
    { key: "logs", label: "Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard content */}
      <div className="bg-white rounded-lg shadow p-4">
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          {activeTab === "users" && <UsersDashboard />}
          {activeTab === "logs" && <LogsDashboard />}
        </Suspense>
      </div>
    </div>
  );
}
