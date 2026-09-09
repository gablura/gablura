import { getDashboardSession } from "@/lib/auth-helpers";
import { developerService } from "@/features/developers/services/developer-service";
import { LuUsers } from "react-icons/lu";
import DevelopersPageClient from "./developers-page-client";

export default async function DevelopersPage() {
  const { userRole } = await getDashboardSession("owner");

  const [developers, counts] = await Promise.all([
    developerService.getAllDevelopers(),
    developerService.getCountByStatus(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
            <LuUsers className="size-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Developer Program
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage registered developers and applications
            </p>
          </div>
        </div>
      </div>

      <DevelopersPageClient developers={developers} counts={counts} />
    </div>
  );
}
