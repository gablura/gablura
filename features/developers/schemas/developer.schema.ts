import { z } from "zod";

export const developerRegistrationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(100, "Nationality must be under 100 characters"),
  primaryStack: z
    .string()
    .min(1, "Primary stack is required")
    .max(100, "Primary stack must be under 100 characters"),
  secondaryStack: z
    .string()
    .max(100, "Secondary stack must be under 100 characters")
    .optional()
    .or(z.literal("")),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    message: "Please select a proficiency level",
  }),
  githubUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  projectLinks: z
    .string()
    .max(2000, "Project links must be under 2000 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  motivation: z
    .string()
    .min(10, "Please tell us why you want to join (at least 10 characters)")
    .max(2000, "Motivation must be under 2000 characters"),
  experience: z
    .string()
    .max(2000, "Experience must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type DeveloperRegistrationFormData = z.infer<
  typeof developerRegistrationSchema
>;
