import { getCachedPublishedCounts } from "@/lib/resources";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = await getCachedPublishedCounts();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer counts={counts} />
    </div>
  );
}
