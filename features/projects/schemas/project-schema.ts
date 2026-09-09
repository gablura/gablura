import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  )
  .default("");

const optionalSlug = z
  .string()
  .max(100, "Slug must be 100 characters or fewer")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
  .or(z.literal(""))
  .transform((val) => val ?? "")
  .default("");

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer")
    .trim(),
  slug: optionalSlug,
  tagline: z
    .string()
    .max(200, "Tagline must be 200 characters or fewer")
    .trim()
    .default(""),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be 5000 characters or fewer")
    .trim(),
  techStack: z
    .string()
    .max(500, "Tech stack must be 500 characters or fewer")
    .trim()
    .default(""),
  frontendUrl: optionalUrl,
  backendUrl: optionalUrl,
  repositoryUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.boolean().default(false),
  status: z.enum(["active", "archived", "in-development"]).default("in-development"),
});

export const updateProjectSchema = createProjectSchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
