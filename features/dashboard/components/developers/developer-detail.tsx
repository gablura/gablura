import {
  LuGithub,
  LuGlobe,
  LuLinkedin,
  LuExternalLink,
} from "react-icons/lu";
import {
  type Developer,
  STATUS_BADGE,
  PROFICIENCY_LABEL,
} from "./types";

function LinkButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
    >
      <Icon className="size-3.5" />
      {label}
      <LuExternalLink className="size-3" />
    </a>
  );
}

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-3">
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <p className="mt-1 text-sm font-medium text-foreground">{children}</p>
    </div>
  );
}

function SectionBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

export function DeveloperDetail({ developer }: { developer: Developer }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {developer.name}
          </h3>
          <p className="text-sm text-muted-foreground">{developer.email}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[developer.status]}`}
        >
          {developer.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard label="Nationality">{developer.nationality}</InfoCard>
        <InfoCard label="Proficiency">
          {PROFICIENCY_LABEL[developer.proficiency] ?? developer.proficiency}
        </InfoCard>
        <InfoCard label="Primary Stack">{developer.primaryStack}</InfoCard>
        {developer.secondaryStack && (
          <InfoCard label="Secondary Stack">
            {developer.secondaryStack}
          </InfoCard>
        )}
      </div>

      {(developer.githubUrl ||
        developer.portfolioUrl ||
        developer.linkedinUrl) && (
        <div className="flex flex-wrap gap-2">
          {developer.githubUrl && (
            <LinkButton href={developer.githubUrl} icon={LuGithub} label="GitHub" />
          )}
          {developer.portfolioUrl && (
            <LinkButton href={developer.portfolioUrl} icon={LuGlobe} label="Portfolio" />
          )}
          {developer.linkedinUrl && (
            <LinkButton href={developer.linkedinUrl} icon={LuLinkedin} label="LinkedIn" />
          )}
        </div>
      )}

      {developer.bio && (
        <SectionBlock label="Bio">{developer.bio}</SectionBlock>
      )}
      {developer.experience && (
        <SectionBlock label="Experience">{developer.experience}</SectionBlock>
      )}
      <SectionBlock label="Motivation">{developer.motivation}</SectionBlock>
      {developer.projectLinks && (
        <SectionBlock label="Project Links">
          <span className="whitespace-pre-wrap">{developer.projectLinks}</span>
        </SectionBlock>
      )}
    </div>
  );
}
