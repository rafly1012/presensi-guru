import axios from "axios";

const api = axios.create({
  baseURL: "https://server-presensi.vercel.app/api",
});

// inject JWT di header setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
