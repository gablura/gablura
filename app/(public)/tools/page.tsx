import type { Metadata } from "next";
import { getCachedPublishedByType } from "@/lib/resources";
import ToolsHero from "@/features/tools/sections/tools-hero";
import ToolsGrid from "@/features/tools/sections/tools-grid";

export const metadata: Metadata = {
  title: "Tools — Gablura",
  description:
    "Utilities that remove repetitive work. CLI helpers, generators, and developer experience enhancements built for real workflows.",
};

export const revalidate = 60;

export default async function ToolsPage() {
  const tools = await getCachedPublishedByType("tool");

  return (
    <>
      <ToolsHero count={tools.length} />
      <ToolsGrid tools={tools} />
    </>
  );
}
