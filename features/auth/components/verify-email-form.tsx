"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuLoader, LuCheck, LuCircleAlert } from "react-icons/lu";

interface VerifyEmailFormProps {
  token: string | null;
}

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    () => (token ? "loading" : "error")
  );
  const [message, setMessage] = useState(() =>
    token ? "" : "Missing verification token"
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (!res.ok) {
          const body = await res.json();
          setStatus("error");
          setMessage(body.error || "Verification failed");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Something went wrong");
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

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

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <LuLoader className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">
            Verifying your email...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-muted">
            <LuCheck className="h-6 w-6 text-success" />
          </div>
          <p className="text-sm text-foreground">{message}</p>
          <Link
            href="/login"
            className="mt-2 text-sm text-accent hover:text-accent-hover"
          >
            Continue to sign in
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-muted">
            <LuCircleAlert className="h-6 w-6 text-error" />
          </div>
          <p className="text-sm text-foreground">{message}</p>
          <Link
            href="/login"
            className="mt-2 text-sm text-accent hover:text-accent-hover"
          >
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
}
