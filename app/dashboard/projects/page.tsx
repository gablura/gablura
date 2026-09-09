import { getDashboardSession } from "@/lib/auth-helpers";
import { getProjects } from "@/actions/projects";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import ProjectsPageClient from "./projects-page-client";

export default async function ProjectsPage() {
  const { userRole, userId } = await getDashboardSession();
  const result = await getProjects();
  const projects = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
          <HiOutlineBuildingLibrary className="size-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Projects
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {userRole === "owner"
              ? "Manage all projects"
              : "Manage your projects"}
          </p>
        </div>
      </div>

      <ProjectsPageClient
        projects={projects as import("@/types/projects").Project[]}
        callerRole={userRole}
        callerId={userId}
      />
    </div>
  );
}
