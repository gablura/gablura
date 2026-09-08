import { SiGithub } from "react-icons/si";
import { LuMail, LuClock } from "react-icons/lu";

export function ContactInfo() {
  return (
    <div className="space-y-4">
      {/* Email */}
      <div className="rounded-xl border border-border-subtle bg-surface p-5">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Email
        </span>
        <div className="mt-2 flex items-center gap-2">
          <LuMail className="size-4 shrink-0 text-text-muted" />
          <a
            href="mailto:gabluraorg@gmail.com"
            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            gabluraorg@gmail.com
          </a>
        </div>
      </div>

      {/* GitHub */}
      <div className="rounded-xl border border-border-subtle bg-surface p-5">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
          GitHub
        </span>
        <div className="mt-2 flex items-center gap-2">
          <SiGithub className="size-4 shrink-0 text-text-muted" />
          <a
            href="https://github.com/gablura"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            github.com/gablura
          </a>
        </div>
      </div>

      {/* Response time */}
      <div className="rounded-xl border border-border-subtle bg-surface p-5">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Response time
        </span>
        <div className="mt-2 flex items-center gap-2">
          <LuClock className="size-4 shrink-0 text-text-muted" />
          <p className="text-sm font-medium text-foreground">
            24-48 hours
          </p>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-xl border border-border-subtle bg-surface p-5">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Availability
        </span>
        <div className="mt-2 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success" />
          <p className="text-sm font-medium text-foreground">
            Open for collaboration
          </p>
        </div>
      </div>
    </div>
  );
}
