import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(await getAuthOptions());

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-container">
          <Link
            href="/dashboard"
            className="text-foreground font-semibold tracking-tight text-lg"
          >
            Gablura<span className="text-accent">.</span> Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-container px-container py-10">
        {children}
      </main>
    </div>
  );
}
