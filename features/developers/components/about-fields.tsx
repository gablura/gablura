import { LuBriefcase } from "react-icons/lu";
import { FieldGroup, TEXTAREA_CLASS } from "./field-group";

type FieldErrors = Record<string, string[]> | undefined;

export function AboutFields({ errors }: { errors: FieldErrors }) {
  return (
    <>
      <FieldGroup label="Notable Projects" hint="(optional, comma-separated URLs or descriptions)" htmlFor="projectLinks" error={errors?.projectLinks?.[0]}>
        <div className="relative">
          <LuBriefcase className="pointer-events-none absolute left-3 top-3.5 size-4 text-text-muted" />
          <textarea id="projectLinks" name="projectLinks" rows={3} placeholder="https://github.com/you/project1 - Description of what it does" className={`${TEXTAREA_CLASS} pl-10`} />
        </div>
      </FieldGroup>

      <FieldGroup label="Short Bio" hint="(optional, a few sentences about yourself)" htmlFor="bio" error={errors?.bio?.[0]}>
        <textarea id="bio" name="bio" rows={3} placeholder="Tell us about yourself..." className={TEXTAREA_CLASS} />
      </FieldGroup>

      <FieldGroup label="Experience & Skills" hint="(optional)" htmlFor="experience" error={errors?.experience?.[0]}>
        <textarea id="experience" name="experience" rows={3} placeholder="Describe your relevant experience, projects you've worked on, or skills you want to contribute..." className={TEXTAREA_CLASS} />
      </FieldGroup>

      <FieldGroup label="Why do you want to join Gablura?" htmlFor="motivation" error={errors?.motivation?.[0]}>
        <textarea id="motivation" name="motivation" rows={4} placeholder="What interests you about Gablura? What would you like to contribute when your spot opens up?" className={TEXTAREA_CLASS} />
      </FieldGroup>
    </>
  );
}
