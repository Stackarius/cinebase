import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const SESSION_EXPIRED_EVENT = "cinebase:session-expired";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshRequest: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshRequest = null;
          });
      }

      await refreshRequest;
      return api(originalRequest);
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }

      return Promise.reject(refreshError);
    }
  },
);