// src/api/user.js
import axios from "./axios";

// List all users
export const fetchUsers = async () => {
  const res = await axios.get("/admin/users"); // assume backend route
  return res.data.users;
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
