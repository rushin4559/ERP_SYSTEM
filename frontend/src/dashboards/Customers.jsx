import React, { useState, useEffect } from "react";
import CustomerCardList from "../components/customers/CustomerCardList";
import CustomerForm from "../components/customers/CustomerForm/CustomerForm";
import useCustomers from "../hooks/useCustomers";
import { getCustomers, exportCustomersToCsv } from "../api/customer/customers";
import MetaHeader from "../shared-ui/MetaDataHeader";
import Pagination from "../shared-ui/Pagination";
import HeaderActionsButtons from "../shared-ui/HeaderActionButtons";
import DataTable from "../shared-ui/DataTable";
import SharedFilter from "../shared-ui/SharedFilter";
import CustomerFilters from "../components/customers/CustomerFilters";
export default function Customers() {
  const {
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
  } = useCustomers();

  // Responsive: Use card list for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Keep these in sync on mount and when global filters change from outside
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Export customers CSV handler with confirmation
  const handleExport = async (exportFilters) => {
    try {
      const { meta } = await getCustomers({ ...exportFilters, page: 1, limit: 1 });

      if (meta.total === 0) {
        alert("No customers found with the selected filters.");
        return;
      }

      const confirmed = window.confirm(`Export ${meta.total} customers matching the selected filters to CSV?`);

      if (confirmed) {
        await exportCustomersToCsv(exportFilters);
      }
    } catch (error) {
      alert("Failed to export customers: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = () => {
    handleApplyFilters(localFilters)
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Customers</h1>
        </header>

        <section>
          <HeaderActionsButtons
            selectedCount={selectedIds.length}
            onDeleteMultiple={handleDeleteMultiple}
            onOpenCreate={handleCreate}
            loading={loading}
          />
        </section>

        <section>
          <MetaHeader
            total={totalCustomers}
            pages={totalPages}
            page={page}
            limit={limit}
            showingCount={customers.length}
          />
        </section>

        <section>
          <SharedFilter
            onApply={handleApplyClick}
            onReset={() => {
              const reset = {
                customer_name: "",
                state_name: "",
                created_from: "",
                created_to: "",
                updated_from: "",
                updated_to: "",
                sort_by: "created_at",
                sort_order: "desc",
              };
              setLocalFilters(reset);  // reset localFilters in UI
              setFilters(reset);       // reset global filters triggers reload once
            }}
            onExport={handleExport}
          >
            <CustomerFilters filters={localFilters} onChange={handleChange} />
          </SharedFilter>
        </section>

        <section className="rounded-lg bg-white shadow-md p-4 overflow-x-auto">
          {isMobile ? (
            <CustomerCardList
              customers={customers}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onEdit={handleUpdate}
              onDelete={handleDeleteSingle}
            />
          ) : (
            <DataTable
              data={customers}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              showActions={true}       // show edit/delete buttons like CustomerRow
              showCheckboxes={true}    // show selection checkboxes column
              onEdit={handleUpdate}
              onDelete={handleDeleteSingle}
              rowKey="id"              // assuming your customers use 'id' as key
              columns={[
                { header: "Customer Name", key: "customer_name" },
                { header: "Vendor Code", key: "vendor_code" },
                { header: "Address", key: "address" },
                { header: "Phone", key: "phone_no" },
                { header: "Email", key: "email_id" },
                { header: "Contact Person", key: "contact_person" },
                { header: "PAN", key: "PAN_NO" },
                { header: "GSTN", key: "GSTN" },
                { header: "State Code", key: "state_code" },
                { header: "State Name", key: "state_name" },
                { header: "Created At", key: "created_at" },
                { header: "Updated At", key: "updated_at" },
              ]}
            />
          )}
        </section>

        <section>
          <Pagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
          />
        </section>

        <CustomerForm
          key={editingCustomer?.id || "new"}
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingCustomer}
        />

        {loading && (
          <div className="mt-4 flex items-center justify-center text-gray-500 text-lg">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
