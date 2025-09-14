// src/components/admin/Users/UserTable.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../../api/user";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import UserForm from "./UserForm";

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const handleCreateClick = () => {
        setEditUser(null);     // create साठी form रिकामं
        setIsModalOpen(true);  // modal उघड
    };

    const handleUpdateClick = (user) => {
        setEditUser(user);     // update साठी user भरून दे
        setIsModalOpen(true);  // modal उघड
    };


    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchUsers();
            // latest user first
            setUsers(
                Array.isArray(data)
                    ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    : []
            );
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        const userToDelete = users.find((u) => u.id === id);
        if (!userToDelete) return;

        if (
            !window.confirm(
                `Are you sure you want to delete user "${userToDelete.username}" with role "${userToDelete.role}"?`
            )
        )
            return;

        setDeletingId(id);
        try {
            await deleteUser(id);
            toast.success("User deleted successfully");
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Users</h2>
                <button
                    onClick={handleCreateClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create User
                </button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">Created At</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="px-4 py-2 border">{user.username}</td>
                                <td className="px-4 py-2 border">{user.role}</td>
                                <td className="px-4 py-2 border">
                                    {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}
                                </td>

                                <td className="px-4 py-2 border space-x-2">
                                    <button
                                        className="p-1 text-blue-600 hover:text-blue-800"
                                        onClick={() => handleUpdateClick(user)}
                                        title="Edit User"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="p-1 text-red-600 hover:text-red-800"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deletingId === user.id}
                                        title="Delete User"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <UserForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadUsers}
                initialData={editUser}
            />

        </div>
    );
}
