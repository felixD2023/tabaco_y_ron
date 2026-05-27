import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// En cliente: `/api/v1` (mismo origen, monolito Next).
// En SSR (Node): URL absoluta del propio servidor Next.
const SERVER_BASE = (process.env.INTERNAL_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const API_VERSION_PREFIX = "/api/v1";

export const API_URL_BASE = typeof window === "undefined" ? SERVER_BASE : "";

export const AUTH_TOKEN_KEY = "tyr_auth_token";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (typeof window === "undefined") return;
  if (token === null) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

const axiosInstance = axios.create({
  baseURL: `${API_URL_BASE}${API_VERSION_PREFIX}`,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
