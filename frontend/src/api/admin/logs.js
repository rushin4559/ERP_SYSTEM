// src/api/logs.js
import axios from "../axios";

export async function getLogs(params = {}) {
  // params: { page, limit, search, status, service, from, to, sort }
  const res = await axios.get("/admin/logs", { params });
  console.log("Logs fetched:", res.data);
  return res.data; // { page, limit, total, data: [...] }
}

export async function exportLogs(params = {}) {
  // params: { username, status, from, to, format }
  const res = await axios.get("/admin/logs/export", { 
    params, 
    responseType: "blob" // important for file downloads
  });
  return res.data; // blob
}

