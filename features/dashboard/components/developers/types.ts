export interface Developer {
  _id?: { toString(): string } | string;
  name: string;
  email: string;
  nationality: string;
  primaryStack: string;
  secondaryStack: string;
  proficiency: string;
  githubUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  projectLinks: string;
  bio: string;
  motivation: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export const STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning-muted text-warning border-warning-border",
  approved: "bg-success-muted text-success border-success-border",
  rejected: "bg-error-muted text-error border-error-border",
};

export const PROFICIENCY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDeveloperId(dev: Developer): string {
  if (typeof dev._id === "object" && dev._id?.toString) {
    return dev._id.toString();
  }
  return String(dev._id);
}
