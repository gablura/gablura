"use client";

import type { Resource } from "@/types/resources";

interface ToolApiReferenceProps {
  tool: Resource;
}

export default function ToolApiReference({ tool }: ToolApiReferenceProps) {
  const docs = tool.documentation;
  const apiReference = docs?.apiReference || "";

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">API Reference</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete API documentation for {tool.name}.
        </p>
      </div>

      {apiReference ? (
        <div className="mt-6">
          {/* Split by double newlines to detect sections */}
          {apiReference.split("\n\n").map((block, i) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            const lines = trimmed.split("\n");
            const firstLine = lines[0];

            // Detect if it's a heading (starts with # or is all caps and short)
            const isHeading =
              firstLine.startsWith("#") ||
              (firstLine === firstLine.toUpperCase() &&
                firstLine.length < 60 &&
                lines.length === 1);

            // Detect code block
            const isCodeBlock =
              trimmed.startsWith("```") || trimmed.startsWith("function ") ||
              trimmed.startsWith("const ") || trimmed.startsWith("export ");

            if (isHeading) {
              const headingText = firstLine.replace(/^#+\s*/, "");
              return (
                <div key={i} className="mt-6 first:mt-0">
                  <h4 className="text-base font-semibold text-foreground">
                    {headingText}
                  </h4>
                </div>
              );
            }

            if (isCodeBlock) {
              return (
                <div key={i} className="mt-4">
                  <div className="overflow-x-auto rounded-lg border border-border-subtle bg-code-background p-4">
                    <pre className="font-mono text-sm leading-6 text-foreground">
                      <code>{trimmed}</code>
                    </pre>
                  </div>
                </div>
              );
            }

            // Check if it's a list
            const isList = lines.every(
              (l) => l.trim().startsWith("-") || l.trim().startsWith("*") || l.trim() === ""
            );

            if (isList) {
              return (
                <div key={i} className="mt-4 space-y-2">
                  {lines
                    .map((l) => l.replace(/^[-*]\s*/, "").trim())
                    .filter(Boolean)
                    .map((item, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="leading-6">{item}</span>
                      </div>
                    ))}
                </div>
              );
            }

            // Default: render as text block
            return (
              <div key={i} className="mt-4">
                <div className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {trimmed}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-border-subtle bg-background p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border-subtle bg-surface mx-auto">
            <svg
              className="size-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            API reference documentation will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}
