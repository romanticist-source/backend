import type {
  UserHelpCardRepository,
  CreateUserHelpCardInput,
  UpdateUserHelpCardInput,
  UserHelpCard,
} from '../../domain/user-help-card.js'

export class UserHelpCardUseCase {
  constructor(private readonly repository: UserHelpCardRepository) {}

  async getAllHelpCards(): Promise<UserHelpCard[]> {
    return this.repository.findAll()
  }

  async getHelpCardById(id: string): Promise<UserHelpCard | null> {
    return this.repository.findById(id)
  }

  async getHelpCardByUserId(userId: string): Promise<UserHelpCard | null> {
    return this.repository.findByUserId(userId)
  }

  async createHelpCard(input: CreateUserHelpCardInput): Promise<UserHelpCard> {
    if (!input.userId) {
      throw new Error('UserId is required')
    }

    const existing = await this.repository.findByUserId(input.userId)
    if (existing) {
      throw new Error('User already has a help card')
    }

    return this.repository.create(input)
  }

  async updateHelpCard(id: string, input: UpdateUserHelpCardInput): Promise<UserHelpCard | null> {
    return this.repository.update(id, input)
  }

  async deleteHelpCard(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }
}
