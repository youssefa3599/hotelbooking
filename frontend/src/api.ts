import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Remove withCredentials because you send token via Authorization header
   withCredentials: true, 
});

export default api;
