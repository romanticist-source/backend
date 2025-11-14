import type {
  EmergencyContactRepository,
  CreateEmergencyContactInput,
  UpdateEmergencyContactInput,
  EmergencyContact,
} from '../../domain/emergency-contact.js'

export class EmergencyContactUseCase {
  constructor(private repository: EmergencyContactRepository) {}

  async getAllEmergencyContacts(): Promise<EmergencyContact[]> {
    return this.repository.findAll()
  }

  async getEmergencyContactsByUserId(userId: string): Promise<EmergencyContact[]> {
    return this.repository.findByUserId(userId)
  }

  async getEmergencyContactsByHelperId(helperId: string): Promise<EmergencyContact[]> {
    return this.repository.findByHelperId(helperId)
  }

  async getEmergencyContact(userId: string, helperId: string): Promise<EmergencyContact | null> {
    return this.repository.findByUserAndHelper(userId, helperId)
  }

  async createEmergencyContact(input: CreateEmergencyContactInput): Promise<EmergencyContact> {
    if (!input.userId || !input.helperId || !input.name || !input.phoneNumber) {
      throw new Error('UserId, HelperId, Name, and PhoneNumber are required')
    }

    const existing = await this.repository.findByUserAndHelper(input.userId, input.helperId)
    if (existing) {
      throw new Error('Emergency contact already exists for this user-helper combination')
    }

    return this.repository.create(input)
  }

  async updateEmergencyContact(
    userId: string,
    helperId: string,
    input: UpdateEmergencyContactInput
  ): Promise<EmergencyContact | null> {
    return this.repository.update(userId, helperId, input)
  }

  async deleteEmergencyContact(userId: string, helperId: string): Promise<boolean> {
    return this.repository.delete(userId, helperId)
  }
}
