import type { Metadata } from "next";
import { getCachedPublishedByType } from "@/lib/resources";
import PackagesHero from "@/features/packages/sections/packages-hero";
import PackagesGrid from "@/features/packages/sections/packages-grid";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Reusable building blocks for full-stack applications. Authentication, authorization, and composable primitives published to npm.",
  openGraph: {
    title: "Packages — Gablura",
    description:
      "Reusable building blocks for full-stack applications. Authentication, authorization, and composable primitives published to npm.",
  },
  twitter: {
    title: "Packages — Gablura",
    description:
      "Reusable building blocks for full-stack applications. Authentication, authorization, and composable primitives published to npm.",
  },
};

export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await getCachedPublishedByType("package");

  return (
    <>
      <PackagesHero count={packages.length} />
      <PackagesGrid packages={packages} />
    </>
  );
}
