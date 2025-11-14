import type {
  UserStatusCardRepository,
  UserStatusCardDiseaseRepository,
  CreateUserStatusCardInput,
  UpdateUserStatusCardInput,
  UserStatusCard,
  CreateUserStatusCardDiseaseInput,
  UpdateUserStatusCardDiseaseInput,
  UserStatusCardDisease,
} from '../../domain/user-status-card.js'

export class UserStatusCardUseCase {
  constructor(
    private statusCardRepository: UserStatusCardRepository,
    private diseaseRepository: UserStatusCardDiseaseRepository
  ) {}

  async getAllStatusCards(): Promise<UserStatusCard[]> {
    return this.statusCardRepository.findAll()
  }

  async getStatusCardById(id: string): Promise<UserStatusCard | null> {
    return this.statusCardRepository.findById(id)
  }

  async getStatusCardByUserId(userId: string): Promise<UserStatusCard | null> {
    return this.statusCardRepository.findByUserId(userId)
  }

  async createStatusCard(input: CreateUserStatusCardInput): Promise<UserStatusCard> {
    if (!input.userId) {
      throw new Error('UserId is required')
    }

    const existing = await this.statusCardRepository.findByUserId(input.userId)
    if (existing) {
      throw new Error('User already has a status card')
    }

    return this.statusCardRepository.create(input)
  }

  async updateStatusCard(id: string, input: UpdateUserStatusCardInput): Promise<UserStatusCard | null> {
    return this.statusCardRepository.update(id, input)
  }

  async deleteStatusCard(id: string): Promise<boolean> {
    return this.statusCardRepository.delete(id)
  }

  // Disease management
  async getAllDiseases(): Promise<UserStatusCardDisease[]> {
    return this.diseaseRepository.findAll()
  }

  async getDiseaseById(id: string): Promise<UserStatusCardDisease | null> {
    return this.diseaseRepository.findById(id)
  }

  async getDiseasesByStatusCardId(statusCardId: string): Promise<UserStatusCardDisease[]> {
    return this.diseaseRepository.findByStatusCardId(statusCardId)
  }

  async createDisease(input: CreateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease> {
    if (!input.userStatusCardId || !input.name) {
      throw new Error('UserStatusCardId and Name are required')
    }

    return this.diseaseRepository.create(input)
  }

  async updateDisease(id: string, input: UpdateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease | null> {
    return this.diseaseRepository.update(id, input)
  }

  async deleteDisease(id: string): Promise<boolean> {
    return this.diseaseRepository.delete(id)
  }
}
