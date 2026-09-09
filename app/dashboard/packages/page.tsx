import { getDashboardSession } from "@/lib/auth-helpers";
import { getResources } from "@/actions/resources";
import { HiOutlineCube } from "react-icons/hi2";
import { RESOURCE_TYPE_SINGULAR } from "@/types/resources";
import PackagesPageClient from "./packages-page-client";

export default async function PackagesPage() {
  const { userRole, userId } = await getDashboardSession();
  const resources = await getResources("package");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
          <HiOutlineCube className="size-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {RESOURCE_TYPE_SINGULAR.package}s
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {userRole === "owner"
              ? "Manage all packages"
              : "Manage your packages"}
          </p>
        </div>
      </div>

      <PackagesPageClient
        resources={resources}
        callerRole={userRole}
        callerId={userId}
      />
    </div>
  );
}
