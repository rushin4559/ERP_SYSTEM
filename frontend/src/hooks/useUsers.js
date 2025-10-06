import { useState, useEffect } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/authadmin/user";
import { toast } from "react-toastify";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination (if needed later)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filters (basic example; extend as needed)
  const [filters, setFilters] = useState({
    username: "",
    role: "",
  });

  // Fetch users (no pagination in your API so far; can extend if backend supports)
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await fetchUsers();
      // Optional client-side filtering for username and role
      let filteredUsers = allUsers;
      if (filters.username) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(filters.username.toLowerCase())
        );
      }
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      setUsers(filteredUsers);
      setTotalPages(1);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line
  }, [filters]);

  // Open create modal
  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  // Open update modal
  const handleUpdate = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  // Form submit (create/update)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? updated : u))
        );
        toast.success("User updated successfully!");
        return updated;
      } else {
        const newUser = await createUser(formData);
        setUsers((prev) => [newUser, ...prev]);
        toast.success("User created successfully!");
        return newUser;
      }
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(err?.response?.data?.message || "Failed to save user.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Single delete
  const handleDeleteSingle = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const res = await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(res.message || "User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete (optional, add API if backend supports)
  // Could implement similar to handleDeleteMultiple in useCustomers

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // reset page if you plan pagination later
    setPage(1);
  };

  return {
    users,
    selectedIds,
    formOpen,
    editingUser,
    loading,
    page,
    limit,
    totalPages,
    filters,
    setSelectedIds,
    setFormOpen,
    setPage,
    setLimit,
    setFilters,
    handleCreate,
    handleUpdate,
    handleFormSubmit,
    handleDeleteSingle,
    handleApplyFilters,
  };
}
