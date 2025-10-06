// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = loading || !username.trim() || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setLoading(true);
    try {
      // AuthContext.login uses your src/api/auth.loginApi internally
      await login(username.trim(), password);

      // success toast
      toast.success("Login successful — चढ तू पुढे!");

      // read user from localStorage (AuthContext saves it synchronously)
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const role = user?.role;

      // redirect based on role
      if (role === "admin") navigate("/home", { replace: true });
      else navigate("/home", { replace: true });
    } catch (err) {
      // backend error message (e.g. "Invalid username or password")
      const msg = err?.response?.data?.error || err?.message || "Server error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="तुझं username"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition ${
              isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" fill="currentColor" className="opacity-75"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
