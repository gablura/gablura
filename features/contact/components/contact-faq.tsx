"use client";

import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const FAQ_ITEMS = [
  {
    question: "What is Gablura?",
    answer:
      "Gablura is a developer-focused organization building packages, SDKs, tools, and infrastructure for modern full-stack development. It's not an agency or portfolio — it's a digital headquarters for everything built under the Gablura identity.",
  },
  {
    question: "How do I install Gablura packages?",
    answer:
      "Each package has its own npm install command. Visit the packages page to browse available packages and copy the install command for the one you need. All packages are published to npm under the @gablura scope.",
  },
  {
    question: "Are Gablura packages open source?",
    answer:
      "Yes. Most Gablura packages are MIT licensed. You're free to use, modify, and distribute them. Check individual package repositories for specific license information.",
  },
  {
    question: "How can I contribute?",
    answer:
      "Contributions are welcome. Open issues for bugs or feature requests, submit pull requests on GitHub, or start discussions. Every package is open to community feedback and improvement.",
  },
  {
    question: "Do you offer enterprise support?",
    answer:
      "Not yet. Gablura is currently maintained by a solo developer. Enterprise support and consulting may be available in the future as the ecosystem grows.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "Open an issue on the relevant GitHub repository with steps to reproduce, expected behavior, and actual behavior. Include your environment details (OS, Node version, package version) when possible.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground">
          {question}
        </span>
        <LuChevronDown
          className="size-4 shrink-0 text-text-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="grid transition-all duration-200"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactFaq() {
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item) => (
        <FaqItem
          key={item.question}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </div>
  );
}
