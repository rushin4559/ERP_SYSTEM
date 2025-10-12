import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../../api/authadmin/user";
import { toast } from "react-toastify";

export default function UserForm({ isOpen, onClose, onSuccess, onSubmit, initialData }) {
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || "",
        password: "", // do not prefill password
        role: initialData.role || "",
      });
    } else {
      setForm({ username: "", password: "", role: "" });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocalSubmit = async (e) => {
    e.preventDefault();

    if (form.role === "admin") {
      const confirmed = window.confirm("⚠️ You are assigning 'Admin' role. This is sensitive. Are you sure?");
      if (!confirmed) return;
    }

    // Call the injected handleFormSubmit with form data
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      // error toast handled in useUsers.handleFormSubmit
    }
  };

  const isDisabled = !form.username || (!initialData && !form.password) || !form.role;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {initialData ? "Update User" : "Create User"}
        </h2>

        <form onSubmit={handleLocalSubmit} className="space-y-5">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Password */}
          {!initialData && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          )}

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled || loading}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${isDisabled || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
