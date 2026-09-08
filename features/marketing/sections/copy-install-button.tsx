"use client";

import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";

export default function CopyInstallButton({
  package: pkg,
  size = "default",
}: {
  package: string;
  size?: "default" | "sm";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`npm install ${pkg}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "shrink-0 rounded-md text-text-muted transition-colors hover:text-foreground hover:bg-surface",
        size === "sm" ? "p-1" : "p-1.5"
      )}
      aria-label="Copy install command"
    >
      {copied ? (
        <LuCheck
          className={cn("text-success", size === "sm" ? "size-3.5" : "size-4")}
        />
      ) : (
        <LuCopy className={size === "sm" ? "size-3.5" : "size-4"} />
      )}
    </button>
  );
}
