import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { updateUsernameApi, changePasswordApi } from "../api/profile";

export default function Profile() {
    const { user, setUser } = useAuth(); // username update करीता context
    const [username, setUsername] = useState(user?.username || "");
    const [usernameLoading, setUsernameLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setUsernameLoading(true);
        try {
            const data = await updateUsernameApi(username.trim());
            toast.success(data.message);
            // Update username in AuthContext + localStorage
            if (setUser) setUser((prev) => {
                const updated = { ...prev, username: data.username };
                localStorage.setItem("user", JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "Server error";
            toast.error(msg);
        } finally {
            setUsernameLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
            <h1 className="text-2xl font-semibold mb-6 text-center">Profile</h1>

            {/* Username update */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-md mx-auto">
                <h2 className="text-lg font-medium mb-3">Change Username</h2>
                <form onSubmit={handleUsernameSubmit} className="space-y-3">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="New username"
                    />
                    <button
                        type="submit"
                        disabled={usernameLoading || !username.trim()}
                        className={`w-full py-2 rounded text-white ${usernameLoading || !username.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {usernameLoading ? "Updating..." : "Update Username"}
                    </button>
                </form>
            </div>

            {/* Password change */}
            <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
                <h2 className="text-lg font-medium mb-3">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Current password"
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="New password"
                    />
                    <button
                        type="submit"
                        disabled={passwordLoading || !currentPassword || !newPassword}
                        className={`w-full py-2 rounded text-white ${passwordLoading || !currentPassword || !newPassword ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {passwordLoading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
