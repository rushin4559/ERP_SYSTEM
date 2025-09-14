// src/api/auth.js
import axios from "./axios";

export async function loginApi(username, password) {
  const res = await axios.post("/auth/login", { username, password });
  return res.data;
}
