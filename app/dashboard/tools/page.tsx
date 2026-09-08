import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { getResources } from "@/actions/resources";
import { redirect } from "next/navigation";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import type { Role } from "@/types/roles";
import { RESOURCE_TYPE_SINGULAR } from "@/types/resources";
import ToolsPageClient from "./tools-page-client";

export default async function ToolsPage() {
  const session = await getServerSession(await getAuthOptions());
  if (!session) redirect("/login");

  const userRole = (session.user?.role ?? "user") as Role;
  const userId = session.user?.id as string;
  if (userRole !== "owner" && userRole !== "admin") redirect("/dashboard");

  const resources = await getResources("tool");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
          <HiOutlineWrenchScrewdriver className="size-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {RESOURCE_TYPE_SINGULAR.tool}s
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {userRole === "owner"
              ? "Manage all tools"
              : "Manage your tools"}
          </p>
        </div>
      </div>

      <ToolsPageClient
        resources={resources}
        callerRole={userRole}
        callerId={userId}
      />
    </div>
  );
}
