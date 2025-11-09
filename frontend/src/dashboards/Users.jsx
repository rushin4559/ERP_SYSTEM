import React, { useState, useEffect } from "react";
import UserForm from "../components/admin/users/UserForm";
import useUsers from "../hooks/useUsers";
import HeaderActionsButtons from "../shared-ui/HeaderActionButtons";
import DataTable from "../shared-ui/DataTable";
import MetaHeader from "../shared-ui/MetaDataHeader";
import Pagination from "../shared-ui/Pagination";
import SharedFilter from "../shared-ui/SharedFilter";
import UserFilters from "../components/admin/users/UserFilters"; // Assume a UserFilters component with filter inputs

export default function Users() {
  const {
    users,
    selectedIds,
    formOpen,
    editingUser,
    loading,
    page,
    limit,
    totalPages,
    totalUsers, // assuming your hook provides totalUsers count
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
  } = useUsers();

  const [localFilters, setLocalFilters] = useState(filters);

  // Sync localFilters with global filters on mount and external changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = () => {
    handleApplyFilters(localFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Users</h1>
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
            total={totalUsers}
            pages={totalPages}
            page={page}
            limit={limit}
            showingCount={users.length}
          />
        </section>

        <section>
          <SharedFilter
            onApply={handleApplyClick}
            onReset={() => {
              const reset = {
                username: "",
                role: "",
                created_from: "",
                created_to: "",
                sort_by: "created_at",
                sort_order: "desc",
              };
              setLocalFilters(reset);
              setFilters(reset);
            }}
            // Add onExport if user export to CSV is supported, else omit
          >
            <UserFilters filters={localFilters} onChange={handleChange} />
          </SharedFilter>
        </section>

        <section className="rounded-lg bg-white shadow-md p-4 overflow-x-auto">
          <DataTable
            data={users}
            loading={loading}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            showActions={true}
            showCheckboxes={true}
            onEdit={handleUpdate}
            onDelete={handleDeleteSingle}
            rowKey="id"
            columns={[
              { header: "Username", key: "username" },
              { header: "Role", key: "role" },
              { header: "Created At", key: "created_at" },
            ]}
            onSortChange={(key, order) => {
              setFilters((prev) => ({
                ...prev,
                sort_by: key,
                sort_order: order,
              }));
              setPage(1);
            }}
            initialSortBy={filters.sort_by}
            initialOrder={filters.sort_order}
          />
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

        <UserForm
          key={editingUser?.id || "new"}
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingUser}
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
