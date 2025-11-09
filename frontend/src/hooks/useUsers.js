import { useState, useEffect } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
} from "../api/authadmin/user";
import { toast } from "react-toastify";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters including sorting and date filters
  const [filters, setFilters] = useState({
    username: "",
    role: "",
    created_at_min: "",
    created_at_max: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Fetch users with pagination, filters, sorting from backend
  const fetchUsersWithFilters = async () => {
    setLoading(true);
    try {
      const { users: rows, meta } = await fetchUsers({
        page,
        limit,
        ...filters,
      });
      setUsers(rows);
      setTotalPages(meta.totalPages);
      setTotalUsers(meta.total);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithFilters();
    // eslint-disable-next-line
  }, [page, limit, filters]);

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
        await fetchUsersWithFilters();
        toast.success("User updated successfully!");
        return updated;
      } else {
        const newUser = await createUser(formData);
        await fetchUsersWithFilters();
        toast.success("User created successfully!");
        return newUser;
      }
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to save user."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Single delete
  const handleDeleteSingle = async (id) => {
    if (!id) return;
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) return;
    if (!window.confirm(`Are you sure you want to delete ${users[i].username}?`))
      return;

    setLoading(true);
    try {
      const res = await deleteUser(id);
      await fetchUsersWithFilters();
      toast.success(res.message || "User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete
  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;
    const userNames = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => u.username)
      .join(", ");
    if (
      !window.confirm(`Are you sure you want to delete ${userNames}?`)
    )
      return;

    setLoading(true);
    try {
      const res = await deleteMultipleUsers(selectedIds);
      await fetchUsersWithFilters();
      setSelectedIds([]);
      toast.success(
        res.message || `${selectedIds.length} user(s) deleted successfully.`
      );
    } catch (err) {
      console.error("Error deleting users:", err);
      toast.error(err?.response?.data?.message || "Failed to delete users.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and reset to first page
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
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
    totalUsers,
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
    handleDeleteMultiple,
    handleApplyFilters,
  };
}
