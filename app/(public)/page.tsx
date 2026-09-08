import { getCachedPublishedCounts, getCachedFeaturedPackage, getCachedLatestPackages } from "@/lib/resources";
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
    <>
      <HeroSection packages={latestPackages} />
      <EcosystemSection counts={counts} />
      <FeaturedPackageSection pkg={featured} />
      <WhySection />
      <ProjectsSection resources={latestPackages} />
      <EngineeringPrinciplesSection />
      <FinalCtaSection />
    </>
  );
}
