import type { 
  User, 
  UserRepository, 
  CreateUserInput, 
  UpdateUserInput 
} from '../../domain/user.js'

// Application Layer - Use Cases
export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id)
  }

  async getAllUsers(includeDeleted = false): Promise<User[]> {
    return await this.userRepository.findAll(includeDeleted)
  }

  async getUserByMail(mail: string): Promise<User | null> {
    return await this.userRepository.findByMail(mail)
  }

  async createUser(input: CreateUserInput): Promise<User> {
    // Business logic validation
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required')
    }
    
    if (!input.mail || input.mail.trim() === '') {
      throw new Error('Mail is required')
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.mail)) {
      throw new Error('Invalid email format')
    }

    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByMail(input.mail)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    return await this.userRepository.create(input)
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id)
    
    if (!existingUser) {
      return null
    }

    if (existingUser.isDeleted) {
      throw new Error('Cannot update deleted user')
    }

    // Validation for update
    if (input.mail !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.mail)) {
        throw new Error('Invalid email format')
      }

      // Check if another user has this email
      const userWithSameMail = await this.userRepository.findByMail(input.mail)
      if (userWithSameMail && userWithSameMail.id !== id) {
        throw new Error('Another user with this email already exists')
      }
    }

    return await this.userRepository.update(id, input)
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id)
    
    if (!existingUser) {
      return false
    }

    // Hard delete
    return await this.userRepository.delete(id)
  }

  async softDeleteUser(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id)
    
    if (!existingUser) {
      return false
    }

    if (existingUser.isDeleted) {
      throw new Error('User is already deleted')
    }

    // Soft delete
    return await this.userRepository.softDelete(id)
  }

  async upsertGoogleUser(input: CreateUserInput): Promise<User> {
    if (!input || !input.id || !input.mail || !input.name) {
      throw new Error('Invalid Google payload')
    }

    return await this.userRepository.upsertGoogle(input)
  }

}
