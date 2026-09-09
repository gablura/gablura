import {
  LuUser,
  LuMail,
  LuMapPin,
  LuCode,
} from "react-icons/lu";
import { FieldGroup, INPUT_CLASS, SELECT_CLASS } from "./field-group";

type FieldErrors = Record<string, string[]> | undefined;

export function IdentityFields({ errors }: { errors: FieldErrors }) {
  return (
    <>
      <FieldGroup label="Full Name" htmlFor="name" error={errors?.name?.[0]}>
        <div className="relative">
          <LuUser className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="name" name="name" type="text" placeholder="Your full name" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Email Address" htmlFor="email" error={errors?.email?.[0]}>
        <div className="relative">
          <LuMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="email" name="email" type="email" placeholder="you@example.com" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Nationality" hint="(for community diversity)" htmlFor="nationality" error={errors?.nationality?.[0]}>
        <div className="relative">
          <LuMapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="nationality" name="nationality" type="text" placeholder="e.g. Indian, Nigerian, Brazilian" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Primary Tech Stack" htmlFor="primaryStack" error={errors?.primaryStack?.[0]}>
        <div className="relative">
          <LuCode className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="primaryStack" name="primaryStack" type="text" placeholder="e.g. Next.js, React, Node.js" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Secondary Stack" hint="(optional)" htmlFor="secondaryStack" error={errors?.secondaryStack?.[0]}>
        <div className="relative">
          <LuCode className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="secondaryStack" name="secondaryStack" type="text" placeholder="e.g. Python, Go, PostgreSQL" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Proficiency Level" htmlFor="proficiency" error={errors?.proficiency?.[0]}>
        <select id="proficiency" name="proficiency" className={SELECT_CLASS}>
          <option value="">Select your level</option>
          <option value="beginner">Beginner (0-1 years)</option>
          <option value="intermediate">Intermediate (1-3 years)</option>
          <option value="advanced">Advanced (3-5 years)</option>
          <option value="expert">Expert (5+ years)</option>
        </select>
      </FieldGroup>
    </>
  );
}
