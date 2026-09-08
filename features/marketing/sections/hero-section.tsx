"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuCopy, LuCheck } from "react-icons/lu";
import type { Resource } from "@/types/resources";

const FALLBACK_PACKAGES = [
  { name: "@gablura/auth-next", label: "Auth Next" },
  { name: "@gablura/auth-core", label: "Auth Core" },
];

const FEATURES = [
  "Authentication",
  "Authorization",
  "Sessions",
  "Security",
];

const INTERVAL = 3500;

interface HeroSectionProps {
  packages: Resource[];
}

export default function HeroSection({ packages }: HeroSectionProps) {
  const displayPackages =
    packages.length > 0
      ? packages.map((p) => ({ name: p.name, label: p.name }))
      : FALLBACK_PACKAGES;

  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % displayPackages.length);
  }, [displayPackages.length]);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const copyInstall = async (pkg: string) => {
    try {
      await navigator.clipboard.writeText(`npm install ${pkg}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-background"
      aria-labelledby="hero-heading"
      style={{
        backgroundImage: `
          linear-gradient(180deg, var(--surface) 0%, var(--background) 60%),
          repeating-linear-gradient(90deg, var(--border-subtle) 0 1px, transparent 1px var(--spacing-hero-rod))
        `,
        backgroundSize: "100% 100%, 100% var(--spacing-hero-rod)",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="mx-auto flex max-w-container flex-col px-container"
        style={{ minHeight: "72vh", paddingTop: "12vh", paddingBottom: "8vh" }}
      >
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent mb-6">
            The Ecosystem
          </p>

          <h1
            id="hero-heading"
            className="text-5xl font-semibold tracking-tight leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="text-foreground">Open source</span>{" "}
            <span className="text-accent">infrastructure</span>{" "}
            <span className="text-muted-foreground">for developers.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Packages, SDKs, and tools that compose into serious software —
            with the precision you expect from the teams you trust.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/docs">
              <Button size="lg" className="gap-2 rounded-lg px-7">
                Get Started
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/ecosystem">
              <Button variant="secondary" size="lg" className="rounded-lg px-7">
                Explore the Ecosystem
              </Button>
            </Link>
          </div>

          {/* Package slider */}
          <div className="mt-12 max-w-md">
            <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-code-background px-5 py-3.5 text-sm font-mono">
              <span className="text-accent font-semibold shrink-0">$</span>
              <span className="text-foreground truncate">
                npm install {displayPackages[active]?.name}
              </span>
              <button
                type="button"
                onClick={() => copyInstall(displayPackages[active]?.name ?? "")}
                className="ml-auto shrink-0 rounded p-1 text-text-muted transition-colors hover:text-foreground hover:bg-surface"
                aria-label="Copy install command"
              >
                {copied ? (
                  <LuCheck className="h-4 w-4 text-success" />
                ) : (
                  <LuCopy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Dots */}
            <div className="mt-3 flex items-center gap-2">
              {displayPackages.map((pkg, i) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-border-strong hover:bg-muted-foreground"
                  }`}
                  aria-label={pkg.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mt-8">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-3.5 py-2 text-xs font-mono uppercase tracking-wide text-muted-foreground"
            >
              <svg
                className="h-3.5 w-3.5 text-accent shrink-0"
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.145 1.053l-8 10.5a.75.75 0 01-1.127 0l-3.75-5a.75.75 0 011.06-1.06l2.25 2.25h3.75a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[11px]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
