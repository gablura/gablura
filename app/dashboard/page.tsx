import { getDashboardSession } from "@/lib/auth-helpers";
import WelcomeSection from "@/features/dashboard/sections/welcome-section";
import StatsGrid from "@/features/dashboard/sections/stats-grid";
import QuickActions from "@/features/dashboard/sections/quick-actions";

export default async function DashboardPage() {
  const { session, userRole } = await getDashboardSession("user");
  const displayName =
    session.user?.name || session.user?.email?.split("@")[0] || "there";

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
