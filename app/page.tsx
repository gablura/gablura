import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HeroSection from "./components/ui/sections/hero-section";
import EcosystemSection from "./components/ui/sections/ecosystem-section";
import FeaturedPackageSection from "./components/ui/sections/featured-package-section";
import WhySection from "./components/ui/sections/why-section";
import ProjectsSection from "./components/ui/sections/projects-section";
import EngineeringPrinciplesSection from "./components/ui/sections/engineering-principles-section";
import FinalCtaSection from "./components/ui/sections/final-cta-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <EcosystemSection />
        <FeaturedPackageSection />
        <WhySection />
        <ProjectsSection />
        <EngineeringPrinciplesSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}