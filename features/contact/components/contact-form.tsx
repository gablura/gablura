"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  LuUser,
  LuMail,
  LuHash,
  LuMessageSquare,
  LuCircleAlert,
  LuCheck,
  LuLoaderCircle,
} from "react-icons/lu";
import {
  sendMessage,
  type ContactFormState,
} from "../actions/send-message";

const initialState: ContactFormState = {
  success: false,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:bg-primary/85 disabled:opacity-50"
    >
      {pending ? (
        <>
          <LuLoaderCircle className="size-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send message"
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    sendMessage,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Error banner */}
      {state.error && !state.fieldErrors && (
        <div className="flex items-center gap-2 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error-foreground">
          <LuCircleAlert className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Success banner */}
      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-success-border bg-success-muted px-4 py-3 text-sm text-success-foreground">
          <LuCheck className="size-4 shrink-0" />
          Message sent successfully. We&apos;ll get back to you within 24-48
          hours.
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <div className="relative">
          <LuUser className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
        {state.fieldErrors?.name && (
          <p className="mt-1.5 text-xs text-error">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <div className="relative">
          <LuMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="mt-1.5 text-xs text-error">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="sr-only">
          Subject
        </label>
        <div className="relative">
          <LuHash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Subject"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
        {state.fieldErrors?.subject && (
          <p className="mt-1.5 text-xs text-error">
            {state.fieldErrors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <div className="relative">
          <LuMessageSquare className="pointer-events-none absolute left-3 top-3.5 size-4 text-text-muted" />
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Your message..."
            className="w-full resize-y rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
        {state.fieldErrors?.message && (
          <p className="mt-1.5 text-xs text-error">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
