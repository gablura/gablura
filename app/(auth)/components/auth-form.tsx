"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { LuMail, LuLock, LuUser, LuArrowRight, LuLoader, LuCheck, LuCircleAlert, LuEye, LuEyeOff } from "react-icons/lu";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
  callbackUrl?: string;
}

export function AuthForm({ mode, callbackUrl = "/dashboard" }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";
  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData | RegisterData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginData | RegisterData) => {
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { signIn } = await import("next-auth/react");
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          window.location.assign(callbackUrl);
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const body = await res.json();

        if (!res.ok) {
          setError(body.error || "Registration failed");
          return;
        }

        setSuccess("Account created. Check your email for verification.");
      }
    } catch {
      setError("Something went wrong. Try again.");
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
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isLogin
            ? "Sign in to access the dashboard"
            : "Enter your details to get started"}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error-foreground">
            <LuCircleAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success-border bg-success-muted px-4 py-3 text-sm text-success-foreground">
          <LuCheck className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <div className="relative">
              <LuUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                type="text"
                placeholder="Name"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
                {...register("name")}
              />
            </div>
            {"name" in errors && errors.name && (
              <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="relative">
            <LuMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <LuLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-50"
        >
          {isSubmitting ? (
            <LuLoader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {isLogin ? "Sign in" : "Create account"}
              <LuArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            <Link
              href="/forgot-password"
              className="text-accent transition-colors hover:text-accent-hover"
            >
              Forgot password?
            </Link>
            <p className="mt-3">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-accent transition-colors hover:text-accent-hover"
              >
                Register
              </Link>
            </p>
          </>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent transition-colors hover:text-accent-hover"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
