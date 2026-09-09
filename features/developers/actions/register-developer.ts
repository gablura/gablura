"use server";

import { developerRegistrationSchema } from "../schemas/developer.schema";
import { developerService } from "../services/developer-service";

export type DeveloperRegistrationFormState = {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

export async function registerDeveloper(
  _prevState: DeveloperRegistrationFormState,
  formData: FormData
): Promise<DeveloperRegistrationFormState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    nationality: formData.get("nationality") as string,
    primaryStack: formData.get("primaryStack") as string,
    secondaryStack: formData.get("secondaryStack") as string,
    proficiency: formData.get("proficiency") as string,
    githubUrl: formData.get("githubUrl") as string,
    portfolioUrl: formData.get("portfolioUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    projectLinks: formData.get("projectLinks") as string,
    bio: formData.get("bio") as string,
    motivation: formData.get("motivation") as string,
    experience: formData.get("experience") as string,
  };

  const result = developerRegistrationSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (field) {
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
    }
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  try {
    await developerService.registerDeveloper(result.data);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof Error && error.name === "DeveloperAlreadyExistsError") {
      return {
        success: false,
        error: "A developer with this email is already registered.",
      };
    }
    console.error("Developer registration error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
