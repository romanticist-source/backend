import {
  UserFatigue,
  UserFatigueRepository,
  CreateUserFatigueInput,
  UpdateUserFatigueInput,
} from "../../domain/user-fatigue.js";

export class UserFatigueUseCase {
  constructor(private readonly repository: UserFatigueRepository) {}

  async getAll(): Promise<UserFatigue[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<UserFatigue | null> {
    return this.repository.findById(id);
  }

  async getByUserId(userId: string): Promise<UserFatigue[]> {
    return this.repository.findByUserId(userId);
  }

  async create(input: CreateUserFatigueInput): Promise<UserFatigue> {
    if (input.fatigueLevel < 1 || input.fatigueLevel > 10) {
      throw new Error("Fatigue level must be between 1 and 10");
    }
    return this.repository.create(input);
  }

  async update(
    id: string,
    input: UpdateUserFatigueInput
  ): Promise<UserFatigue | null> {
    if (
      input.fatigueLevel !== undefined &&
      (input.fatigueLevel < 1 || input.fatigueLevel > 10)
    ) {
      throw new Error("Fatigue level must be between 1 and 10");
    }
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
