interface WelcomeSectionProps {
  displayName: string;
}

export default function WelcomeSection({ displayName }: WelcomeSectionProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Welcome back, {displayName}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Here&apos;s what&apos;s happening with your account.
      </p>
    </div>
  );
}
