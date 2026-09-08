"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { LuLock, LuArrowRight, LuLoader, LuCheck, LuCircleAlert, LuEye, LuEyeOff } from "react-icons/lu";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  token: string | null;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Gablura
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          </Link>
        </div>
        <div className="rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error-foreground">
          <LuCircleAlert className="mb-2 mx-auto h-5 w-5" />
          Invalid or missing reset token
        </div>
        <Link
          href="/forgot-password"
          className="mt-4 block text-sm text-accent hover:text-accent-hover"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (!res.ok) {
        setError("Reset failed. The link may have expired.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            Gablura
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error-foreground">
          <LuCircleAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success ? (
        <div className="rounded-lg border border-success-border bg-success-muted px-4 py-3 text-sm text-success-foreground">
          <div className="flex items-center gap-2">
            <LuCheck className="h-4 w-4 shrink-0" />
            Password reset successfully
          </div>
          <Link
            href="/login"
            className="mt-4 block text-center text-sm text-accent hover:text-accent-hover"
          >
            Sign in with new password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              New password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-50"
          >
            {isSubmitting ? (
              <LuLoader className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Reset password
                <LuArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
