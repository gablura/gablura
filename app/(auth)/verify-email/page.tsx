"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return <VerifyEmailForm token={token} />;
}

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
