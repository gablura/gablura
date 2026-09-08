"use client";

import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import type { Resource } from "@/types/resources";
import { cn } from "@/lib/utils";

interface ToolInstallationProps {
  tool: Resource;
}

const PACKAGE_MANAGERS = [
  { key: "npm", label: "npm", command: "npm install" },
  { key: "yarn", label: "yarn", command: "yarn add" },
  { key: "pnpm", label: "pnpm", command: "pnpm add" },
  { key: "bun", label: "bun", command: "bun add" },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-md p-1.5 text-text-muted transition-colors hover:text-foreground hover:bg-surface"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <LuCheck className="size-4 text-success" />
      ) : (
        <LuCopy className="size-4" />
      )}
    </button>
  );
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="group/code">
      {title && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border-subtle bg-surface-elevated px-4 py-2">
          <span className="text-xs font-mono font-medium text-text-muted">
            {title}
          </span>
          <div className="hidden sm:block">
            <CopyButton text={code} />
          </div>
        </div>
      )}
      <div
        className={cn(
          "relative overflow-x-auto border border-border-subtle bg-code-background",
          title ? "rounded-b-lg" : "rounded-lg"
        )}
      >
        <div className="absolute right-2 top-2 sm:hidden">
          <CopyButton text={code} />
        </div>
        <pre className="p-4 font-mono text-sm leading-6">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function parseContentBlocks(raw: string) {
  const blocks: { type: "text" | "code"; content: string; title?: string }[] = [];

  const codeBlockRegex = /```(?:([\w]*)\n)?([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;

  while ((match = codeBlockRegex.exec(raw)) !== null) {
    const textBefore = raw.slice(lastIndex, match.index).trim();
    if (textBefore) {
      blocks.push({ type: "text", content: textBefore });
    }

    const lang = match[1] || "code";
    const code = match[2].trim();
    blocks.push({ type: "code", content: code, title: lang });

    lastIndex = match.index + match[0].length;
  }

  const remaining = raw.slice(lastIndex).trim();
  if (remaining) {
    blocks.push({ type: "text", content: remaining });
  }

  if (blocks.length === 0 && raw.trim()) {
    const sections = raw.split(/\n\n+/);
    sections.forEach((section) => {
      const trimmed = section.trim();
      if (!trimmed) return;

      const looksLikeCode =
        trimmed.startsWith("import ") ||
        trimmed.startsWith("const ") ||
        trimmed.startsWith("export ") ||
        trimmed.startsWith("function ") ||
        trimmed.startsWith("npx ") ||
        trimmed.startsWith("npm ") ||
        trimmed.startsWith("yarn ") ||
        trimmed.startsWith("pnpm ") ||
        (trimmed.includes("{") && trimmed.includes("}") && trimmed.includes(";"));

      if (looksLikeCode) {
        blocks.push({ type: "code", content: trimmed, title: "code" });
      } else {
        blocks.push({ type: "text", content: trimmed });
      }
    });
  }

  return blocks;
}

export default function ToolInstallation({ tool }: ToolInstallationProps) {
  const [activeManager, setActiveManager] = useState("npm");
  const docs = tool.documentation;

  const installation = docs?.installation || "";
  const configuration = docs?.quickStart || "";

  const activeCmd = PACKAGE_MANAGERS.find((m) => m.key === activeManager);
  const installCommand = activeCmd
    ? `${activeCmd.command} ${tool.name}`
    : `npm install ${tool.name}`;

  const configBlocks = configuration ? parseContentBlocks(configuration) : [];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      {/* Install command */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Install</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add {tool.name} to your project.
        </p>

        {/* Package manager tabs */}
        <div className="mt-4 flex items-center gap-1 rounded-lg border border-border-subtle bg-background p-1">
          {PACKAGE_MANAGERS.map((manager) => (
            <button
              key={manager.key}
              type="button"
              onClick={() => setActiveManager(manager.key)}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                activeManager === manager.key
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {manager.label}
            </button>
          ))}
        </div>

        {/* Command block */}
        <div className="mt-3">
          <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-code-background px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-accent">$</span>
              <span className="text-foreground">{installCommand}</span>
            </div>
            <div className="hidden sm:block">
              <CopyButton text={installCommand} />
            </div>
            <div className="sm:hidden">
              <CopyButton text={installCommand} />
            </div>
          </div>
        </div>
      </div>

      {/* Installation docs */}
      {installation && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">
            Installation Guide
          </h3>
          <div className="mt-3 space-y-4">
            {parseContentBlocks(installation).map((block, i) =>
              block.type === "code" ? (
                <CodeBlock key={i} code={block.content} title={block.title} />
              ) : (
                <div
                  key={i}
                  className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground"
                >
                  {block.content}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Quick Start */}
      {configBlocks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">
            Quick Start
          </h3>
          <div className="mt-3 space-y-4">
            {configBlocks.map((block, i) =>
              block.type === "code" ? (
                <CodeBlock key={i} code={block.content} title={block.title} />
              ) : (
                <div
                  key={i}
                  className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground"
                >
                  {block.content}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
