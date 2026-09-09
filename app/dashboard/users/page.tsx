import { getDashboardSession } from "@/lib/auth-helpers";
import { mongoUserStore } from "@/lib/auth";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import UsersPageClient from "./users-page-client";

export default async function UsersPage() {
  const { userRole } = await getDashboardSession("owner");
  const users = await mongoUserStore.findAll();

  return (
    <div className="space-y-6">
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

      <UsersPageClient users={users} callerRole={userRole} />
    </div>
  );
}
