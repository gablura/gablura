"use client";

import type { ReactNode } from "react";

interface DocsLayoutClientProps {
  children: ReactNode;
}

export default function DocsLayoutClient({ children }: DocsLayoutClientProps) {
  return <>{children}</>;
}
