import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/types/roles";
import WelcomeSection from "@/features/dashboard/sections/welcome-section";
import StatsGrid from "@/features/dashboard/sections/stats-grid";
import QuickActions from "@/features/dashboard/sections/quick-actions";

export default async function DashboardPage() {
  const session = await getServerSession(await getAuthOptions());

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user?.role ?? "user") as Role;
  const displayName = session.user?.name || session.user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      <WelcomeSection displayName={displayName} />
      <StatsGrid
        userRole={userRole}
        email={session.user?.email}
        sessionId={session.sessionId}
      />
      <QuickActions userRole={userRole} />
    </div>
  );
}
