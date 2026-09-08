import { Suspense } from "react";
import { Metadata } from "next";
import {
  getCachedPublishedCounts,
  getCachedFeaturedResources,
} from "@/lib/resources";
import EcosystemHero from "@/features/ecosystem/sections/ecosystem-hero";
import EcosystemWhat from "@/features/ecosystem/sections/ecosystem-what";
import EcosystemCategories from "@/features/ecosystem/sections/ecosystem-categories";
import EcosystemFeatured from "@/features/ecosystem/sections/ecosystem-featured";
import EcosystemHowItWorks from "@/features/ecosystem/sections/ecosystem-how-it-works";
import EcosystemValues from "@/features/ecosystem/sections/ecosystem-values";
import EcosystemCta from "@/features/ecosystem/sections/ecosystem-cta";

export const metadata: Metadata = {
  title: "Ecosystem — Gablura",
  description:
    "Explore the Gablura ecosystem. Packages, SDKs, and tools built for modern web development.",
};

export const revalidate = 60;

export default async function EcosystemPage() {
  const [counts, featured] = await Promise.all([
    getCachedPublishedCounts(),
    getCachedFeaturedResources(),
  ]);

  return (
    <>
      <EcosystemHero counts={counts} />
      <EcosystemWhat />
      <EcosystemCategories counts={counts} />
      <EcosystemFeatured resources={featured} />
      <EcosystemHowItWorks />
      <EcosystemValues />
      <EcosystemCta />
    </>
  );
}
