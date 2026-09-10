export type ResourceType = "package" | "tool" | "sdk" | "project";

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  slug: string;
  description: string;
  version: string;
  repositoryUrl: string;
  documentation: ResourceDocumentation;
  authorId: string;
  authorName: string;
  status: "draft" | "published";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceDocumentation {
  overview: string;
  whyItExists: string;
  features: string;
  installation: string;
  quickStart: string;
  apiReference: string;
  examples: string;
  changelog: string;
}

export type ResourceFormData = Pick<
  Resource,
  "name" | "slug" | "description" | "version" | "repositoryUrl" | "status" | "featured"
> & {
  documentation: ResourceDocumentation;
};

export const EMPTY_DOCUMENTATION: ResourceDocumentation = {
  overview: "",
  whyItExists: "",
  features: "",
  installation: "",
  quickStart: "",
  apiReference: "",
  examples: "",
  changelog: "",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  package: "Packages",
  tool: "Tools",
  sdk: "SDKs",
  project: "Projects",
};

export const RESOURCE_TYPE_SINGULAR: Record<ResourceType, string> = {
  package: "Package",
  tool: "Tool",
  sdk: "SDK",
  project: "Project",
};
