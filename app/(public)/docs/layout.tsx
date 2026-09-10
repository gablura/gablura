import DocsLayoutClient from "@/features/docs/components/docs-layout-client";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
