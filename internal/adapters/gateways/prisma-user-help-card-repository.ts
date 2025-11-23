import { PrismaClient } from '@prisma/client'
import type {
  UserHelpCard,
  UserHelpCardRepository,
  CreateUserHelpCardInput,
  UpdateUserHelpCardInput,
} from '../../domain/user-help-card.js'

export class PrismaUserHelpCardRepository implements UserHelpCardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserHelpCard | null> {
    return await this.prisma.userHelpCard.findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: string): Promise<UserHelpCard | null> {
    return await this.prisma.userHelpCard.findUnique({
      where: { userId },
    })
  }

  async findAll(): Promise<UserHelpCard[]> {
    return await this.prisma.userHelpCard.findMany()
  }

  async create(input: CreateUserHelpCardInput): Promise<UserHelpCard> {
    return await this.prisma.userHelpCard.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateUserHelpCardInput): Promise<UserHelpCard | null> {
    try {
      return await this.prisma.userHelpCard.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userHelpCard.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}
