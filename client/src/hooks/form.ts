import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuthErrorMessage, login, register } from "../features/auth/auth.api";
import type { AuthFormValues, RegisterFormValues } from "../features/auth/auth.api";

const emailSchema = z.string().email("Enter a valid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be at most 100 characters");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values: AuthFormValues) => {
    setSubmitError(null);
    try {
      await login(values);

      const state = location.state as { from?: { pathname?: unknown } } | null;
      const pathname = state?.from?.pathname;
      navigate(
        typeof pathname === "string" && pathname.startsWith("/") && !pathname.startsWith("//")
          ? pathname
          : "/",
        { replace: true },
      );
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, "Unable to sign in. Please try again."));
    }
  });

  return {
    register,
    handleSubmit: onSubmit,
    errors,
    isSubmitting,
    submitError,
  };
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register(values);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, "Unable to create your account. Please try again."));
    }
  });

  return {
    register: registerField,
    handleSubmit: onSubmit,
    errors,
    isSubmitting,
    submitError,
  };
};