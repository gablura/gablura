import type { Metadata } from "next";
import { getCachedPublishedByType } from "@/lib/resources";
import SdksHero from "@/features/sdks/sections/sdks-hero";
import SdksGrid from "@/features/sdks/sections/sdks-grid";

export const metadata: Metadata = {
  title: "SDKs",
  description:
    "Type-safe client libraries for every service. Interfaces for powerful systems with first-class TypeScript support.",
  openGraph: {
    title: "SDKs — Gablura",
    description:
      "Type-safe client libraries for every service. Interfaces for powerful systems with first-class TypeScript support.",
  },
  twitter: {
    title: "SDKs — Gablura",
    description:
      "Type-safe client libraries for every service. Interfaces for powerful systems with first-class TypeScript support.",
  },
};

export const revalidate = 60;

export default async function SdksPage() {
  const sdks = await getCachedPublishedByType("sdk");

  return (
    <>
      <SdksHero count={sdks.length} />
      <SdksGrid sdks={sdks} />
    </>
  );
}
