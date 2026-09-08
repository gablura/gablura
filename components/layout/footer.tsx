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
            <Link href="/" className="group inline-flex items-center gap-1.5">
              <span className="text-foreground font-semibold tracking-tight text-lg">
                Gablura
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
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
