"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";

const NAV_LINKS = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/projects", label: "Projects" },
  { href: "/packages", label: "Packages" },
  { href: "/sdks", label: "SDKs" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--background) 80%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
          boxShadow: scrolled
            ? "0 1px 0 0 var(--border-subtle), 0 4px 24px -4px rgba(0,0,0,0.3)"
            : "none",
        }}
      >
        <nav
          className="mx-auto flex h-14 max-w-container items-center justify-between px-container sm:h-16"
          aria-label="Primary"
        >
          {/* Logo */}
          <Link href="/" className="group relative flex items-center">
            <svg viewBox="0 0 160 40" fill="none" className="h-7 w-auto sm:h-8" aria-label="Gablura">
              <defs>
                <linearGradient id="nav-gGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#6366f1"/>
                </linearGradient>
              </defs>
              <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16c5.08 0 9.553-2.37 12.5-6.07V22h-6.5v3.5c-2.16 1.63-4.87 2.5-7.5 2.5-5.79 0-10.5-4.71-10.5-10.5S14.21 7 20 7c3.08 0 5.87 1.33 7.81 3.44L33.12 8.2C30.08 5.26 25.32 3.5 20 3.5V4Z" fill="url(#nav-gGrad)"/>
              <path d="M32 16v4h-6v-4h6Z" fill="#818cf8"/>
              <text x="40" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="600" fill="var(--foreground)" letterSpacing="-0.02em">ablura</text>
            </svg>
          </Link>

          {/* Desktop nav — pill style */}
          <div
            className="hidden items-center gap-0.5 rounded-full border border-border-subtle bg-surface/50 px-1 py-1 sm:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* GitHub */}
            <a
              href="https://github.com/gablura"
              className="group/github inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-surface-elevated hover:text-foreground hover:border-border-strong hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <SiGithub className="h-4 w-4 transition-transform duration-200 group-hover/github:rotate-[-4deg] group-hover/github:scale-110" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-surface sm:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className="absolute h-4 w-5">
                {/* Top bar */}
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    mobileOpen ? "top-2 rotate-45" : "top-0 rotate-0"
                  }`}
                />
                {/* Middle bar */}
                <span
                  className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  }`}
                />
                {/* Bottom bar */}
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    mobileOpen ? "top-2 -rotate-45" : "top-4 rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — outside header to escape its stacking context */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-14 z-[60] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop — fully opaque */}
        <div
          className={`absolute inset-0 bg-background transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Content */}
        <nav
          className={`relative mx-auto flex w-full max-w-container flex-col px-container transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1 pt-6 pb-4">
            {NAV_LINKS.map((link, i) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-3.5 text-2xl font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? "bg-accent-muted text-foreground"
                      : "text-foreground hover:bg-surface"
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border-subtle pt-4 pb-6">
            <a
              href="https://github.com/gablura"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-base font-medium text-foreground transition-all duration-200 hover:bg-surface-elevated hover:border-border-strong"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transitionDelay: mobileOpen ? `${NAV_LINKS.length * 50}ms` : "0ms",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
              }}
            >
              <SiGithub className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
