import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(await getAuthOptions());

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {session?.user?.name ?? session?.user?.email}.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-border-subtle bg-surface p-6">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Role
          </span>
          <p className="mt-2 text-lg font-semibold text-foreground capitalize">
            {session?.user?.role ?? "admin"}
          </p>
        </article>

        <article className="rounded-xl border border-border-subtle bg-surface p-6">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Session
          </span>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {session?.sessionId ? "Active" : "None"}
          </p>
        </article>

        <article className="rounded-xl border border-border-subtle bg-surface p-6">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            Email
          </span>
          <p className="mt-2 text-lg font-semibold text-foreground truncate">
            {session?.user?.email}
          </p>
        </article>
      </div>
    </div>
  );
}
