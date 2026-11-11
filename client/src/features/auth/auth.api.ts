import { isAxiosError } from "axios";
import { api } from "../../lib/axios";

export interface AuthFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends AuthFormValues {
  name: string;
}

interface AuthResponse {
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export const login = async (values: AuthFormValues) => {
  const response = await api.post<AuthResponse>("/auth/login", values);
  return response.data.data;
};

export const register = async (values: RegisterFormValues) => {
  const response = await api.post<AuthResponse>("/auth/register", values);
  return response.data.data;
};

export const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{
    error?: unknown;
    message?: unknown;
    errors?: Record<string, unknown>;
  }>(error)) {
    const fieldErrors = error.response?.data?.errors;
    if (fieldErrors) {
      for (const messages of Object.values(fieldErrors)) {
        if (Array.isArray(messages)) {
          const message = messages.find((value): value is string => typeof value === "string");
          if (message) {
            return message;
          }
        }
      }
    }

    const message = error.response?.data?.error ?? error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
};
