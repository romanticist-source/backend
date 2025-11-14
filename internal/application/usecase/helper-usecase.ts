import type { 
  Helper, 
  HelperRepository, 
  CreateHelperInput, 
  UpdateHelperInput 
} from '../../domain/helper.js'

export class HelperUseCase {
  constructor(private readonly helperRepository: HelperRepository) {}

  async getHelperById(id: string): Promise<Helper | null> {
    return await this.helperRepository.findById(id)
  }

  async getAllHelpers(): Promise<Helper[]> {
    return await this.helperRepository.findAll()
  }

  async getHelperByEmail(email: string): Promise<Helper | null> {
    return await this.helperRepository.findByEmail(email)
  }

  async createHelper(input: CreateHelperInput): Promise<Helper> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required')
    }
    
    if (!input.email || input.email.trim() === '') {
      throw new Error('Email is required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) {
      throw new Error('Invalid email format')
    }

    const existingHelper = await this.helperRepository.findByEmail(input.email)
    if (existingHelper) {
      throw new Error('Helper with this email already exists')
    }

    if (!input.phoneNumber || input.phoneNumber.trim() === '') {
      throw new Error('Phone number is required')
    }

    return await this.helperRepository.create(input)
  }

  async updateHelper(id: string, input: UpdateHelperInput): Promise<Helper | null> {
    const existingHelper = await this.helperRepository.findById(id)
    
    if (!existingHelper) {
      return null
    }

    if (input.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.email)) {
        throw new Error('Invalid email format')
      }

      const helperWithSameEmail = await this.helperRepository.findByEmail(input.email)
      if (helperWithSameEmail && helperWithSameEmail.id !== id) {
        throw new Error('Another helper with this email already exists')
      }
    }

    return await this.helperRepository.update(id, input)
  }

  async deleteHelper(id: string): Promise<boolean> {
    const existingHelper = await this.helperRepository.findById(id)
    
    if (!existingHelper) {
      return false
    }

    return await this.helperRepository.delete(id)
  }
}
