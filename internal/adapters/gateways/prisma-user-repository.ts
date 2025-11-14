import { PrismaClient } from '@prisma/client'
import type { 
  User, 
  UserRepository, 
  CreateUserInput, 
  UpdateUserInput 
} from '../../domain/user.js'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    return user
  }

  async findAll(includeDeleted = false): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: includeDeleted ? {} : { isDeleted: false },
    })
  }

  async findByMail(mail: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { mail },
    })
    return user
  }

  async create(input: CreateUserInput): Promise<User> {
    return await this.prisma.user.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      })
      return true
    } catch {
      return false
    }
  }
}
