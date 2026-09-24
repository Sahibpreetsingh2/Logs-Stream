import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Single Axios instance used by every API module (logApi, alertApi,
 * statisticsApi, healthApi). Components must never call axios directly -
 * they go through the *Api.ts modules, which use this client.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: placeholder for future JWT auth.
// When auth is added, read the token from wherever it's stored and attach it:
//   config.headers.Authorization = `Bearer ${token}`;
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('logstream_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;
  isNetworkError: boolean;
  validationErrors?: Record<string, string>;

  constructor(
    message: string,
    status?: number,
    isNetworkError = false,
    validationErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.validationErrors = validationErrors;
  }
}

// Response interceptor: normalizes every failure into an ApiError so
// components/hooks can render a consistent error state.
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError(
          'Backend unavailable. Check that LogStream is running on ' + BASE_URL,
          undefined,
          true
        )
      );
    }

    const { status, data } = error.response;

    if (status === 400) {
      const validationErrors = data?.errors ?? data?.fieldErrors;
      return Promise.reject(
        new ApiError(data?.message ?? 'Invalid request.', status, false, validationErrors)
      );
    }

    if (status === 404) {
      return Promise.reject(
        new ApiError(data?.message ?? 'The requested resource was not found.', status)
      );
    }

    if (status >= 500) {
      return Promise.reject(
        new ApiError(data?.message ?? 'LogStream backend encountered an error.', status)
      );
    }

    return Promise.reject(new ApiError(data?.message ?? 'Request failed.', status));
  }
);

export default axiosClient;
