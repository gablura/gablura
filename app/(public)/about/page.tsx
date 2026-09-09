import type { Metadata } from "next";
import AboutHero from "@/features/about/sections/about-hero";
import WhatWeBuild from "@/features/about/sections/what-we-build";
import EcosystemOverview from "@/features/about/sections/ecosystem-overview";
import EngineeringPrinciples from "@/features/about/sections/engineering-principles";
import WhoBuilds from "@/features/about/sections/who-builds";
import AboutCta from "@/features/about/sections/about-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gablura is a developer-focused organization building packages, SDKs, tools, and infrastructure for modern full-stack development.",
  openGraph: {
    title: "About — Gablura",
    description:
      "Gablura is a developer-focused organization building packages, SDKs, tools, and infrastructure for modern full-stack development.",
  },
  twitter: {
    title: "About — Gablura",
    description:
      "Gablura is a developer-focused organization building packages, SDKs, tools, and infrastructure for modern full-stack development.",
  },
};

export const revalidate = 3600;

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhatWeBuild />
      <EngineeringPrinciples />
      <EcosystemOverview />
      <WhoBuilds />
      <AboutCta />
    </>
  );
}
