import Link from "next/link";
import { SiGithub } from "react-icons/si";

interface FooterProps {
  counts?: {
    package: number;
    tool: number;
    sdk: number;
  };
}

const PRODUCTS = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/projects", label: "Projects" },
  { href: "/packages", label: "Packages" },
  { href: "/sdks", label: "SDKs" },
  { href: "/tools", label: "Tools" },
] as const;

const RESOURCES = [
  { href: "/docs", label: "Documentation" },
  { href: "/packages", label: "Changelog" },
] as const;

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/join", label: "Developers" },
  { href: "/contact", label: "Contact" },
] as const;

function formatCount(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Footer({ counts }: FooterProps) {
  const total = counts
    ? counts.package + counts.tool + counts.sdk
    : 0;

  return (
    <footer className="border-t border-border-subtle" aria-label="Footer">
      <div className="mx-auto max-w-container px-container">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center">
              <svg viewBox="0 0 160 40" fill="none" className="h-7 w-auto" aria-label="Gablura">
                <defs>
                  <linearGradient id="footer-gGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
                <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16c5.08 0 9.553-2.37 12.5-6.07V22h-6.5v3.5c-2.16 1.63-4.87 2.5-7.5 2.5-5.79 0-10.5-4.71-10.5-10.5S14.21 7 20 7c3.08 0 5.87 1.33 7.81 3.44L33.12 8.2C30.08 5.26 25.32 3.5 20 3.5V4Z" fill="url(#footer-gGrad)"/>
                <path d="M32 16v4h-6v-4h6Z" fill="#818cf8"/>
                <text x="40" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="600" fill="var(--foreground)" letterSpacing="-0.02em">ablura</text>
              </svg>
            </Link>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              Developer infrastructure for modern builders. Packages, SDKs,
              tools, and software built with care.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com/gablura"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-surface-elevated hover:text-foreground"
                aria-label="GitHub"
              >
                <SiGithub className="size-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-muted">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCTS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-muted">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {RESOURCES.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-text-muted">
              Social
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/gablura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <SiGithub className="size-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-border-subtle py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Gablura. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">
            <span>
              PKG <span className="text-foreground">{formatCount(counts?.package ?? 0)}</span>
            </span>
            <span className="text-border">·</span>
            <span>
              SDK <span className="text-foreground">{formatCount(counts?.sdk ?? 0)}</span>
            </span>
            <span className="text-border">·</span>
            <span>
              TOL <span className="text-foreground">{formatCount(counts?.tool ?? 0)}</span>
            </span>
            <span className="text-border">·</span>
            <span>
              TOT <span className="text-foreground">{formatCount(total)}</span>
            </span>
            <span className="text-border">·</span>
            <span>MIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
