import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../../api/user";
import { toast } from "react-toastify";

export default function UserForm({ isOpen, onClose, onSuccess, initialData }) {
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);

  // जर update असेल तर initialData पासून values भरायचे
  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || "",
        password: "", // update करताना password ठेवणार नाही
        role: initialData.role || "",
      });
    } else {
      setForm({ username: "", password: "", role: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        // update
        await updateUser(initialData.id, {
          username: form.username,
          role: form.role,
        });
        toast.success("User updated successfully!");
      } else {
        // create
        await createUser(form);
        toast.success("User created successfully!");
      }

      onSuccess(); // refresh table
      onClose();   // modal बंद कर
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !form.username || (!initialData && !form.password) || !form.role;

  if (!isOpen) return null; // modal बंद असेल तर काहीच दाखवू नको

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {initialData ? "Update User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
          />

          {!initialData && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled || loading}
              className={`px-4 py-2 rounded-lg text-white ${
                isDisabled || loading
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
