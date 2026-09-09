import { Metadata } from "next";
import {
  getCachedPublishedCounts,
  getCachedFeaturedResources,
} from "@/lib/resources";
import { getCachedPublishedProjects, getCachedProjectCounts } from "@/lib/projects";
import EcosystemHero from "@/features/ecosystem/sections/ecosystem-hero";
import EcosystemWhat from "@/features/ecosystem/sections/ecosystem-what";
import EcosystemCategories from "@/features/ecosystem/sections/ecosystem-categories";
import EcosystemFeatured from "@/features/ecosystem/sections/ecosystem-featured";
import EcosystemProjects from "@/features/ecosystem/sections/ecosystem-projects";
import EcosystemHowItWorks from "@/features/ecosystem/sections/ecosystem-how-it-works";
import EcosystemValues from "@/features/ecosystem/sections/ecosystem-values";
import EcosystemCta from "@/features/ecosystem/sections/ecosystem-cta";

export const metadata: Metadata = {
  title: "Ecosystem — Gablura",
  description:
    "Explore the Gablura ecosystem. Packages, SDKs, tools, and projects built for modern web development.",
};

export const revalidate = 60;

export default async function EcosystemPage() {
  const [counts, featured, projects, projectCounts] = await Promise.all([
    getCachedPublishedCounts(),
    getCachedFeaturedResources(),
    getCachedPublishedProjects(),
    getCachedProjectCounts(),
  ]);

  return (
    <>
      <EcosystemHero counts={counts} projectCount={projectCounts.total} />
      <EcosystemWhat />
      <EcosystemCategories counts={counts} projectCount={projectCounts.total} />
      <EcosystemFeatured resources={featured} />
      <EcosystemProjects projects={projects} />
      <EcosystemHowItWorks />
      <EcosystemValues />
      <EcosystemCta />
    </>
  );
}
