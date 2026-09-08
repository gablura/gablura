import { getCachedPublishedCounts, getCachedFeaturedPackage, getCachedLatestPackages } from "@/lib/resources";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/features/marketing/sections/hero-section";
import EcosystemSection from "@/features/marketing/sections/ecosystem-section";
import FeaturedPackageSection from "@/features/marketing/sections/featured-package-section";
import WhySection from "@/features/marketing/sections/why-section";
import ProjectsSection from "@/features/marketing/sections/projects-section";
import EngineeringPrinciplesSection from "@/features/marketing/sections/engineering-principles-section";
import FinalCtaSection from "@/features/marketing/sections/final-cta-section";

export const revalidate = 60;

export default async function Home() {
  const [counts, featured, latestPackages] = await Promise.all([
    getCachedPublishedCounts(),
    getCachedFeaturedPackage(),
    getCachedLatestPackages(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection packages={latestPackages} />
        <EcosystemSection counts={counts} />
        <FeaturedPackageSection pkg={featured} />
        <WhySection />
        <ProjectsSection resources={latestPackages} />
        <EngineeringPrinciplesSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
