import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://www.inithub.site/backend/api";

const api = axios.create({
  baseURL
});

export default api;