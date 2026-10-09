/**
 * FinPilot API Client
 * Centralized Axios instance pointing at the FastAPI backend.
 * All dashboard components import from here — never hard-code the API URL.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s — AI calls can be slow
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — log in dev
apiClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.message ||
      'An unknown error occurred.';
    console.error(`[API Error] ${message}`);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

// ── Typed API calls ────────────────────────────────────────────────────────
export const getCashForecast = (days = 30) =>
  apiClient.get('/api/cash-forecast', { params: { days } }).then((r) => r.data);

export const getCreditScore = () =>
  apiClient.get('/api/credit-score').then((r) => r.data);

export const healthCheck = () =>
  apiClient.get('/api/health').then((r) => r.data);
