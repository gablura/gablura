import type { Metadata } from "next";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { LuMail } from "react-icons/lu";
import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactInfo } from "@/features/contact/components/contact-info";
import { ContactFaq } from "@/features/contact/components/contact-faq";

export const metadata: Metadata = {
  title: "Contact — Gablura",
  description:
    "Get in touch with the Gablura team. Send us a message about packages, SDKs, tools, or collaboration.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
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
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-container px-container">
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Contact
            </span>
            <span className="h-px flex-1 bg-border-subtle" />
          </div>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Let&apos;s get in
            <br />
            <span className="text-muted-foreground">touch.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Have a question, want to collaborate, or just want to say hello?
            Send us a message and we&apos;ll get back to you within 24-48
            hours.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-container px-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Contact form */}
            <article className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Fill out the form below and we&apos;ll respond as soon as
                possible.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </article>

            {/* Contact info */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Contact details
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Prefer reaching out directly? Use any of these channels.
              </p>
              <div className="mt-6">
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 pb-20 sm:pb-28">
        <div className="mx-auto max-w-container px-container">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Quick answers to common questions about Gablura packages, SDKs,
              and tools.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* FAQ items */}
            <div>
              <ContactFaq />
            </div>

            {/* Sidebar CTA */}
            <div>
              <article className="rounded-xl border border-border-subtle bg-surface p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Still have questions?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for? Reach out
                  directly and we&apos;ll help you out.
                </p>
                <div className="mt-5 space-y-2.5">
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85"
                  >
                    <LuMail className="size-4" />
                    Send a message
                  </Link>
                  <a
                    href="https://github.com/gablura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
                  >
                    <SiGithub className="size-4" />
                    Open on GitHub
                  </a>
                  <a
                    href="mailto:gabluraorg@gmail.com"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
                  >
                    <LuMail className="size-4" />
                    gabluraorg@gmail.com
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
