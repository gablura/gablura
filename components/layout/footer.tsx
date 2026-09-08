export default function Footer() {
  return (
    <footer
      className="border-t border-border-subtle bg-surface py-12"
      aria-label="Footer"
    >
      <div className="mx-auto flex flex-col gap-6 max-w-container px-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gablura. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/gablura"
              className="transition-colors hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="/docs"
              className="transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <a
              href="/about"
              className="transition-colors hover:text-foreground"
            >
              About
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">
          <span>PACKAGE / 00</span>
          <span className="text-border">·</span>
          <span>STATUS / BETA</span>
          <span className="text-border">·</span>
          <span>LICENSE / MIT</span>
        </div>
      </div>
    </footer>
  );
}
