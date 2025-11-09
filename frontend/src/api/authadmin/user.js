// src/api/user.js
import axios from "./axios";

// List all users
export const fetchUsers = async (params) => {
  const res = await axios.get("/admin/users", { params });
  // Assuming your backend returns { success, users, meta }
  return {
    users: res.data.users,
    meta: res.data.meta,
  };
};

// Create new user
export const createUser = async (user) => {
  // user = { username, password, role }
  const res = await axios.post("/admin/create-user", user);
  return res.data;
};

// Update existing user (username or role)
export const updateUser = async (id, updates) => {
  // updates = { username?, role? }
  const res = await axios.put(`/admin/update-user/${id}`, updates);
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  const res = await axios.delete(`/admin/delete-user/${id}`);
  return res.data;
};
// Delete multiple users
export const deleteMultipleUsers = async (ids) => {
  const res = await axios.delete('/admin/delete-multiple-users', { data: { ids } });
  return res.data;
};


