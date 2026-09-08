"use client";

import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import type { Resource } from "@/types/resources";
import { cn } from "@/lib/utils";

interface ToolExamplesProps {
  tool: Resource;
}

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
      aria-label="Copy code"
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
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border-subtle bg-surface-elevated px-4 py-2">
          <span className="text-xs font-mono font-medium text-text-muted">
            {title}
          </span>
          {/* Desktop: show on hover */}
          <div className="hidden sm:block">
            <CopyButton text={code} />
          </div>
        </div>
      )}

      {/* Code */}
      <div
        className={cn(
          "relative overflow-x-auto border border-border-subtle bg-code-background",
          title ? "rounded-b-lg" : "rounded-lg"
        )}
      >
        {/* Mobile: always show copy button */}
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

export default function ToolExamples({ tool }: ToolExamplesProps) {
  const docs = tool.documentation;
  const examples = docs?.examples || "";

  // Parse examples into separate code blocks
  const parseExamples = (raw: string) => {
    const blocks: { title: string; code: string }[] = [];

    // Check for markdown code blocks
    const codeBlockRegex = /```(?:[\w]*)\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      const textBefore = raw.slice(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ title: "Example", code: textBefore });
      }

      blocks.push({ title: "Code Example", code: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }

    const remaining = raw.slice(lastIndex).trim();
    if (remaining) {
      blocks.push({ title: "Example", code: remaining });
    }

    if (blocks.length === 0 && raw.trim()) {
      const sections = raw.split(/\n\n+/);
      sections.forEach((section, i) => {
        const trimmed = section.trim();
        if (trimmed) {
          const looksLikeCode =
            trimmed.startsWith("import ") ||
            trimmed.startsWith("const ") ||
            trimmed.startsWith("export ") ||
            trimmed.startsWith("function ") ||
            trimmed.includes("=>") ||
            (trimmed.includes("{") && trimmed.includes("}"));

          blocks.push({
            title: looksLikeCode ? `Example ${i + 1}` : `Usage ${i + 1}`,
            code: trimmed,
          });
        }
      });
    }

    return blocks;
  };

  const exampleBlocks = parseExamples(examples);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Examples</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Learn how to use {tool.name} with these examples.
        </p>
      </div>

      {exampleBlocks.length > 0 ? (
        <div className="mt-6 space-y-6">
          {exampleBlocks.map((block, i) => (
            <CodeBlock key={i} code={block.code} title={block.title} />
          ))}
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
            Code examples will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}
