import { developerRepository } from "../repositories/developer-repository";
import type { DeveloperRegistrationFormData } from "../schemas/developer.schema";

export class DeveloperAlreadyExistsError extends Error {
  constructor() {
    super("A developer with this email is already registered.");
    this.name = "DeveloperAlreadyExistsError";
  }
}

export const developerService = {
  async registerDeveloper(data: DeveloperRegistrationFormData) {
    const existing = await developerRepository.findByEmail(data.email);
    if (existing) {
      throw new DeveloperAlreadyExistsError();
    }
    return developerRepository.create(data);
  },

  async getAllDevelopers() {
    return developerRepository.findAll();
  },

  async getRegistrationCount() {
    return developerRepository.count();
  },

  async getCountByStatus() {
    return developerRepository.countByStatus();
  },
};
