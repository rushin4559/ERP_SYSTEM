// src/api/customerApi.js
import axios from "axios";

const customerApi = axios.create({
  baseURL: import.meta.env.VITE_CUSTOMER_API_URL || "http://192.168.0.104:3001/api",
});


// Attach token automatically
customerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally (optional, same as auth)
customerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default customerApi;
