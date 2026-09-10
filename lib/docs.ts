import fs from "node:fs";
/* turbopackIgnore: true */
import path from "node:path";
import matter from "gray-matter";
import type { ResourceType } from "@/types/resources";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  version?: string;
  status?: string;
  package?: string;
  repository?: string;
  license?: string;
}

export interface DocFile {
  slug: string;
  filename: string;
  meta: DocMeta;
}

export interface DocGroup {
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  version: string;
  repository: string;
  files: DocFile[];
  hasMdx: boolean;
}

/**
 * Real resources in the Gablura ecosystem.
 * Only resources that actually exist.
 */
const RESOURCE_REGISTRY: {
  slug: string;
  name: string;
  type: ResourceType;
  version: string;
  repository: string;
  description: string;
}[] = [
  {
    slug: "auth-core",
    name: "@gablura/auth-core",
    type: "package",
    version: "1.2.4",
    repository: "https://github.com/gablura/focura-auth",
    description: "Production-ready authentication core for Express.js backends.",
  },
  {
    slug: "auth-next",
    name: "@gablura/auth-next",
    type: "package",
    version: "1.2.4",
    repository: "https://github.com/gablura/focura-auth",
    description: "Production-ready Next.js authentication with NextAuth.js.",
  },
  {
    slug: "focura",
    name: "Focura",
    type: "project",
    version: "1.1.0",
    repository: "https://github.com/gaziraihan1/gablura-client",
    description: "Focus Smarter. Manage Workspaces, Projects & Teams.",
  },
];

/**
 * Check if MDX files exist for a given slug
 */
function hasMdxFiles(slug: string): boolean {
  const groupPath = path.join(CONTENT_DIR, slug);
  return fs.existsSync(groupPath);
}

/**
 * Get MDX files for a group
 */
function getMdxFiles(slug: string): DocFile[] {
  const groupPath = path.join(CONTENT_DIR, slug);
  if (!fs.existsSync(groupPath)) return [];

  const files: DocFile[] = [];

  for (const file of fs.readdirSync(groupPath)) {
    if (!file.endsWith(".mdx")) continue;

    const filePath = path.join(groupPath, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    files.push({
      slug: file.replace(/\.mdx$/, ""),
      filename: file,
      meta: {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title ?? file.replace(/\.mdx$/, ""),
        description: data.description ?? "",
        ...data,
      },
    });
  }

  return files;
}

/**
 * Get all doc groups, combining MDX files with resource registry
 */
export function getAllDocGroups(): DocGroup[] {
  return RESOURCE_REGISTRY.map((resource) => {
    const files = hasMdxFiles(resource.slug) ? getMdxFiles(resource.slug) : [];

    return {
      slug: resource.slug,
      title: resource.name,
      description: resource.description,
      type: resource.type,
      version: resource.version,
      repository: resource.repository,
      files,
      hasMdx: files.length > 0,
    };
  });
}

/**
 * Get doc groups filtered by type
 */
export function getDocGroupsByType(type: ResourceType): DocGroup[] {
  return getAllDocGroups().filter((g) => g.type === type);
}

/**
 * Get a single doc group by slug
 */
export function getDocGroup(slug: string): DocGroup | undefined {
  return getAllDocGroups().find((g) => g.slug === slug);
}

/**
 * Get the ordered section slugs for a doc group
 */
export function getDocSectionOrder(slug: string): string[] {
  const SECTION_ORDER = [
    "index",
    "installation",
    "quick-start",
    "configuration",
    "usage",
    "api-reference",
    "examples",
    "security",
    "performance",
    "faq",
    "changelog",
    "contributing",
    "license",
  ];

  const files = getMdxFiles(slug);
  const available = new Set(files.map((f) => f.slug));

  return SECTION_ORDER.filter((s) => available.has(s));
}
