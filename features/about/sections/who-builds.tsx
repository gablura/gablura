import Image from "next/image";
import { SiGithub } from "react-icons/si";

export default function WhoBuilds() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-container">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            05 / Who Builds
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One developer. One vision.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Gablura is built and maintained by a single developer with a focus
            on quality, documentation, and long-term sustainability.
          </p>
        </div>

        <article className="mt-12 rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
            {/* Avatar — top on mobile, side on desktop */}
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-border-subtle sm:size-24">
              <Image
                src="/gablura-founder.png"
                alt="Mohammad Raihan Gazi"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* Content — full width on mobile, flex-1 on desktop */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  Mohammad Raihan Gazi
                </h3>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium text-accent">
                  Founder
                </span>
              </div>
              <p className="mt-0.5 text-sm text-text-muted">
                Founder &amp; Developer
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Building developer infrastructure, open-source packages, and
                tools designed to make full-stack development simpler.
                Everything under the Gablura identity is built with the same
                standards: typed, documented, tested, and shipped with care.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/gaziraihan1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
                >
                  <SiGithub className="size-4" />
                  @gaziraihan1
                </a>
                <a
                  href="https://github.com/gablura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
                >
                  <SiGithub className="size-4" />
                  Gablura
                </a>
              </div>

              {/* Info grid — 2 cols on mobile, 4 cols on desktop */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10">
                <div className="rounded-lg border border-border-subtle bg-background p-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Role
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Sole developer &amp; owner
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-background p-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Focus
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Full-stack · Open Source
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-background p-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Stack
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Next.js · TS · Tailwind
                  </p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-background p-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Status
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-success" />
                    <span className="text-sm font-medium text-foreground">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <p className="mt-6 max-w-xl text-sm text-text-muted">
          As the ecosystem grows, contributors and collaborators are welcome.
          Every package is open to issues, pull requests, and feedback.
        </p>
      </div>
    </section>
  );
}
