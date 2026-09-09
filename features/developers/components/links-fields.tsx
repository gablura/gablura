import {
  LuGithub,
  LuGlobe,
  LuLinkedin,
} from "react-icons/lu";
import { FieldGroup, INPUT_CLASS } from "./field-group";

type FieldErrors = Record<string, string[]> | undefined;

export function LinksFields({ errors }: { errors: FieldErrors }) {
  return (
    <>
      <FieldGroup label="GitHub Profile" hint="(optional)" htmlFor="githubUrl" error={errors?.githubUrl?.[0]}>
        <div className="relative">
          <LuGithub className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="githubUrl" name="githubUrl" type="url" placeholder="https://github.com/yourusername" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="Portfolio / Website" hint="(optional)" htmlFor="portfolioUrl" error={errors?.portfolioUrl?.[0]}>
        <div className="relative">
          <LuGlobe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://yoursite.com" className={INPUT_CLASS} />
        </div>
      </FieldGroup>

      <FieldGroup label="LinkedIn Profile" hint="(optional)" htmlFor="linkedinUrl" error={errors?.linkedinUrl?.[0]}>
        <div className="relative">
          <LuLinkedin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/yourusername" className={INPUT_CLASS} />
        </div>
      </FieldGroup>
    </>
  );
}
