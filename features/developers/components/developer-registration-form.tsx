"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LuCircleAlert, LuCheck, LuLoaderCircle } from "react-icons/lu";
import {
  registerDeveloper,
  type DeveloperRegistrationFormState,
} from "../actions/register-developer";
import { IdentityFields } from "./identity-fields";
import { LinksFields } from "./links-fields";
import { AboutFields } from "./about-fields";

const initialState: DeveloperRegistrationFormState = {
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
          Joining...
        </>
      ) : (
        "Join the Waitlist"
      )}
    </button>
  );
}

export default function DeveloperRegistrationForm() {
  const [state, formAction] = useActionState<
    DeveloperRegistrationFormState,
    FormData
  >(registerDeveloper, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && !state.fieldErrors && (
        <div className="flex items-center gap-2 rounded-lg border border-error-border bg-error-muted px-4 py-3 text-sm text-error-foreground">
          <LuCircleAlert className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-success-border bg-success-muted px-4 py-3 text-sm text-success-foreground">
          <LuCheck className="size-4 shrink-0" />
          You&apos;re on the list. We&apos;ll reach out when a contribution area
          matching your skills opens up.
        </div>
      )}

      <IdentityFields errors={state.fieldErrors} />
      <LinksFields errors={state.fieldErrors} />
      <AboutFields errors={state.fieldErrors} />

      <SubmitButton />
    </form>
  );
}
