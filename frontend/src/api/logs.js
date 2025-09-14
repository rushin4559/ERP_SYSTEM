// src/api/logs.js
import axios from "./axios";

export async function getLogs(params = {}) {
  // params: { page, limit, search, status, service, from, to, sort }
  const res = await axios.get("/admin/logs", { params });
  return res.data; // { page, limit, total, data: [...] }
}

// optional server-side export (returns file blob)
export async function exportLogs(params = {}) {
  const res = await axios.get("/admin/logs", { params: { ...params, export: true }, responseType: "blob" });
  return res.data; // blob
}
