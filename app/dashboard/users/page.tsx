import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { mongoUserStore } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { canManageUsers } from "@/types/roles";
import type { Role } from "@/types/roles";
import { UsersPageClient } from "./users-page-client";

export default async function UsersPage() {
  const session = await getServerSession(await getAuthOptions());

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user?.role ?? "user") as Role;

  if (!canManageUsers(userRole)) {
    redirect("/dashboard");
  }

  const users = await mongoUserStore.findAll();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
            <HiOutlineShieldCheck className="size-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              User management
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Client wrapper handles stats, table, and actions */}
      <UsersPageClient
        users={users}
        callerRole={userRole}
      />
    </div>
  );
}
