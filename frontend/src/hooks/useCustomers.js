// src/hooks/useCustomers.js
import { useState, useEffect } from "react";
import {
  getCustomers,
  deleteCustomer,
  deleteMultipleCustomers,
  createCustomer,
  updateCustomer,
} from "../api/customer/customers";
import { toast } from "react-toastify";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    customer_name: "",
    state_name: "",
    created_from: "",
    created_to: "",
    updated_from: "",
    updated_to: "",
    sort_by: "updated_at",
    sort_order: "desc",
  });

  // Fetch customers with pagination & filters
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { rows, meta } = await getCustomers({ page, limit, ...filters });
      setCustomers(rows);
      setTotalPages(meta.totalPages);
      setTotalCustomers(meta.total);
    } catch (err) {
      console.error("Error fetching customers:", err);
      toast.error("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, limit, filters]);

  // Open create modal
  const handleCreate = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  // Open update modal
  const handleUpdate = (customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  // Form submit (create/update)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingCustomer) {
        const updatedCustomer = await updateCustomer(editingCustomer.id, formData);
        await fetchCustomers();
        toast.success("Customer updated successfully!");
        return updatedCustomer;
      } else {
        const newCustomer = await createCustomer(formData);
        await fetchCustomers();
        toast.success("Customer created successfully!");
        return newCustomer;
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      toast.error(err?.response?.data?.message || "Failed to save customer.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Single delete
  const handleDeleteSingle = async (id) => {
    if (!id) return;
    const i = customers.findIndex((c) => c.id === id);
    if (i === -1) return;
    if (!window.confirm(`Are you sure you want to delete ${customers[i].customer_name}?`)) return;

    setLoading(true);
    try {
      const res = await deleteCustomer(id);
      await fetchCustomers();
      toast.success(res.message || "Customer deleted successfully!");
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error(err?.response?.data?.message || "Failed to delete customer.");
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete
  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;
    const customerNames = customers
      .filter((c) => selectedIds.includes(c.id))
      .map((c) => c.customer_name)
      .join(", ");
    if (!window.confirm(`Are you sure you want to delete ${customerNames}?`)) return;

    setLoading(true);
    try {
      const res = await deleteMultipleCustomers(selectedIds);
      await fetchCustomers();
      setSelectedIds([]);
      toast.success(res.message || `${selectedIds.length} customer(s) deleted successfully.`);
    } catch (err) {
      console.error("Error deleting customers:", err);
      toast.error(err?.response?.data?.message || "Failed to delete customers.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return {
    customers,
    selectedIds,
    formOpen,
    editingCustomer,
    loading,
    page,
    limit,
    totalPages,
    totalCustomers,
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
