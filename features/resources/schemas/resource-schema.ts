import { z } from "zod";

const documentationSchema = z.object({
  overview: z.string().max(5000).default(""),
  whyItExists: z.string().max(5000).default(""),
  features: z.string().max(5000).default(""),
  installation: z.string().max(5000).default(""),
  quickStart: z.string().max(5000).default(""),
  apiReference: z.string().max(10000).default(""),
  examples: z.string().max(5000).default(""),
  changelog: z.string().max(5000).default(""),
});

export type DocumentationInput = z.infer<typeof documentationSchema>;

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

const optionalVersion = z
  .string()
  .max(20, "Version must be 20 characters or fewer")
  .regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g. 1.0.0)")
  .or(z.literal(""))
  .transform((val) => val ?? "")
  .default("");

export const createResourceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer")
    .trim(),
  slug: optionalSlug,
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or fewer")
    .trim(),
  version: optionalVersion,
  repositoryUrl: optionalUrl,
  documentation: documentationSchema.default({
    overview: "",
    whyItExists: "",
    features: "",
    installation: "",
    quickStart: "",
    apiReference: "",
    examples: "",
    changelog: "",
  }),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export const updateResourceSchema = createResourceSchema;

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
