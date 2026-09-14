import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

export function getErrorMessage(err) {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.request) {
    return "Cannot reach the server. Please try again later.";
  }
  return "Something went wrong. Please try again.";
}
