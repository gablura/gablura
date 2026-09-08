import {
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import type { Role } from "@/types/roles";

interface StatsGridProps {
  userRole: Role;
  email: string | null | undefined;
  sessionId: string | undefined;
}

export default function StatsGrid({ userRole, email, sessionId }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-xl border border-border-subtle bg-surface p-5 transition-colors duration-150 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Role
          </span>
          <HiOutlineShieldCheck className="size-4 text-text-muted" />
        </div>
        <p className="mt-2 text-lg font-semibold capitalize text-foreground">
          {userRole}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Your current access level
        </p>
      </article>

      <article className="rounded-xl border border-border-subtle bg-surface p-5 transition-colors duration-150 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Email
          </span>
          <HiOutlineEnvelope className="size-4 text-text-muted" />
        </div>
        <p className="mt-2 truncate text-lg font-semibold text-foreground">
          {email}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Account email
        </p>
      </article>

      <article className="rounded-xl border border-border-subtle bg-surface p-5 transition-colors duration-150 hover:bg-surface-elevated sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Session
          </span>
          <span className="size-2 rounded-full bg-success" />
        </div>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {sessionId ? "Active" : "None"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {sessionId ? "Secure session in progress" : "No active session"}
        </p>
      </article>
    </div>
  );
}
