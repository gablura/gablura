import { getDashboardSession } from "@/lib/auth-helpers";
import { getResources } from "@/actions/resources";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { RESOURCE_TYPE_SINGULAR } from "@/types/resources";
import SdksPageClient from "./sdks-page-client";

export default async function SdksPage() {
  const { userRole, userId } = await getDashboardSession();
  const result = await getResources("sdk");
  const resources = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
          <HiOutlineCommandLine className="size-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {RESOURCE_TYPE_SINGULAR.sdk}s
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {userRole === "owner"
              ? "Manage all SDKs"
              : "Manage your SDKs"}
          </p>
        </div>
      </div>

      <SdksPageClient
        resources={resources as import("@/types/resources").Resource[]}
        callerRole={userRole}
        callerId={userId}
      />
    </div>
  );
}
