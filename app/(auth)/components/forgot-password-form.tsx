"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { LuMail, LuArrowRight, LuLoader, LuCheck, LuCircleAlert } from "react-icons/lu";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError("Something went wrong");
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
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
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
            If an account exists with that email, you&apos;ll receive a reset link.
          </div>
          <Link
            href="/login"
            className="mt-4 block text-center text-sm text-accent hover:text-accent-hover"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <p className="mt-1.5 text-xs text-error">
                {errors.email.message}
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
                Send reset link
                <LuArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-accent transition-colors hover:text-accent-hover"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
