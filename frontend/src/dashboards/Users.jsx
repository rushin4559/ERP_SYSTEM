// src/pages/Users.jsx
import React, { useState, useEffect } from "react";

import UserForm from "../components/admin/users/UserForm";
import useUsers from "../hooks/useUsers";
import HeaderActionsButtons from "../shared-ui/HeaderActionButtons";
import DataTable from "../shared-ui/DataTable";

export default function Users() {
    const {
        users,
        selectedIds,
        formOpen,
        editingUser,
        loading,
        setSelectedIds,
        setFormOpen,
        handleCreate,
        handleUpdate,
        handleFormSubmit,
        handleDeleteSingle,
        handleDeleteMultiple,
    } = useUsers();

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
                            { header: "Created At", key: "created_at" }
                        ]}
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
