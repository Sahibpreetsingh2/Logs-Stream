import axios from 'axios';

// Base URL comes from an env var in production builds; in dev, Vite proxies
// /api to the Spring Boot backend (see vite.config.js), so a relative path works.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token if present (adjust to match your Spring Security setup, e.g. JWT).
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response?.status === 401) {
      console.warn('Unauthorized — redirecting to login not yet wired up.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
