import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { changePasswordApi } from "../api/authadmin/profile";

export default function Profile() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // confirm modal
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to change your password? If you forget it, you may lose access."
    );
    if (!confirmed) return;

    if (!currentPassword || !newPassword) return;

    setPasswordLoading(true);
    try {
      const data = await changePasswordApi(currentPassword, newPassword);
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Server error";
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Profile</h1>

      <div className="max-w-2xl mx-auto space-y-8">

        {/* Username display card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Username</h2>
          <p className="text-lg text-gray-800">{user?.username}</p>
        </div>

        {/* Password change card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <button
              type="submit"
              disabled={passwordLoading || !currentPassword || !newPassword}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                passwordLoading || !currentPassword || !newPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
