import { Button } from "@/components/ui/button";
import type { Resource } from "@/types/resources";
import CopyInstallButton from "@/features/marketing/sections/copy-install-button";

interface ToolHeaderProps {
  tool: Resource;
}

export default function ToolHeader({ tool }: ToolHeaderProps) {
  const overview = tool.documentation?.overview || tool.description || "";
  const firstSentence = overview.split(". ")[0] + ".";

  return (
    <section className="relative overflow-hidden pb-8 pt-24 sm:pt-32">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Accent gradient */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-container px-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            href="/tools"
            className="transition-colors duration-150 hover:text-foreground"
          >
            Tools
          </a>
          <span className="text-border">/</span>
          <span className="text-foreground">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="mt-8 flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-accent/15 bg-accent-muted font-mono text-2xl font-bold text-accent shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]">
            {tool.name.split("/").pop()?.substring(0, 2).toUpperCase() ?? "T"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {tool.name}
              </h1>
            </div>
            {firstSentence && firstSentence !== "." && (
              <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
                {firstSentence}
              </p>
            )}
          </div>
        </div>

        {/* Install command */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-3 rounded-lg border border-border-subtle bg-code-background px-4 py-3 font-mono text-sm">
            <span className="text-accent">$</span>
            <span className="text-foreground">npm install {tool.name}</span>
            <CopyInstallButton package={tool.name} />
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {[
            { key: "VERSION", value: tool.version },
            { key: "STATUS", value: tool.status },
            ...(tool.authorName
              ? [{ key: "AUTHOR", value: tool.authorName }]
              : []),
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 text-xs font-mono"
            >
              <span className="text-text-muted">{item.key}</span>
              <span className="h-3 w-px bg-border" />
              <span className="font-semibold uppercase text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <a href={`/docs/tool/${tool.slug}`}>
            <Button variant="default" size="sm" className="gap-2">
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              Docs
            </Button>
          </a>
          {tool.repositoryUrl && (
            <a
              href={tool.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm" className="gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Source
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
