import axios from "axios";

const api = axios.create({
  baseURL: "https://server-presensi.vercel.app/api",
  withCredentials: true,
});

export default api;
