import React, { Suspense, lazy, useState } from "react";

// Lazy load dashboards
const UsersDashboard = lazy(() => import("../components/admin/Users/UserTable"));
const LogsDashboard = lazy(() => import("../components/admin/logs/LogTable"));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { key: "users", label: "Users" },
    { key: "logs", label: "Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl bg-gray-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
          {activeTab === "users" && <UsersDashboard />}
          {activeTab === "logs" && <LogsDashboard />}
        </Suspense>
      </div>
    </div>
  );
}
