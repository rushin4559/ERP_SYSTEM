// src/utils/customerUtils.js
import { toast } from "react-toastify";
import {
  getCustomers,
  deleteCustomer,
  deleteMultipleCustomers,
  createCustomer,
  updateCustomer,
} from "../api/customer/customers";

// Fetch customers with pagination & filters
export const fetchCustomersUtil = async ({ page, limit, filters, setLoading, setCustomers, setTotalPages, setTotalCustomers }) => {
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

// Handle create (just open form)
export const handleCreateUtil = (setEditingCustomer, setFormOpen) => {
  setEditingCustomer(null);
  setFormOpen(true);
};

// Handle update (prefill form)
export const handleUpdateUtil = (customer, setEditingCustomer, setFormOpen) => {
  setEditingCustomer(customer);
  setFormOpen(true);
};

// Form submit (create/update)
export const handleFormSubmitUtil = async ({ formData, editingCustomer, setCustomers, setLoading }) => {
  setLoading(true);
  try {
    if (editingCustomer) {
      const updatedCustomer = await updateCustomer(editingCustomer.id, formData);
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? updatedCustomer : c))
      );
      toast.success("Customer updated successfully!");
      return updatedCustomer;
    } else {
      const newCustomer = await createCustomer(formData);
      setCustomers((prev) => [newCustomer, ...prev]);
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
export const handleDeleteSingleUtil = async ({ id, setCustomers, setLoading }) => {
  if (!id) return;

  const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
  if (!confirmDelete) return;

  setLoading(true);
  try {
    const res = await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.success(res.message || "Customer deleted successfully!");
  } catch (err) {
    console.error("Error deleting customer:", err);
    toast.error(err?.response?.data?.message || "Failed to delete customer.");
  } finally {
    setLoading(false);
  }
};

// Multiple delete
export const handleDeleteMultipleUtil = async ({ selectedIds, setCustomers, setSelectedIds, setLoading }) => {
  if (selectedIds.length === 0) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${selectedIds.length} customer(s)?`
  );
  if (!confirmDelete) return;

  setLoading(true);
  try {
    const res = await deleteMultipleCustomers(selectedIds);
    setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
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
export const handleApplyFiltersUtil = (newFilters, setFilters, setPage) => {
  setFilters(newFilters);
  setPage(1);
};
