import { PrismaClient } from '@prisma/client'
import type {
  UserStatusCard,
  UserStatusCardRepository,
  CreateUserStatusCardInput,
  UpdateUserStatusCardInput,
  UserStatusCardDisease,
  UserStatusCardDiseaseRepository,
  CreateUserStatusCardDiseaseInput,
  UpdateUserStatusCardDiseaseInput,
} from '../../domain/user-status-card.js'

export class PrismaUserStatusCardRepository implements UserStatusCardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserStatusCard | null> {
    return await this.prisma.userStatusCard.findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: string): Promise<UserStatusCard | null> {
    return await this.prisma.userStatusCard.findUnique({
      where: { userId },
    })
  }

  async findAll(): Promise<UserStatusCard[]> {
    return await this.prisma.userStatusCard.findMany()
  }

  async create(input: CreateUserStatusCardInput): Promise<UserStatusCard> {
    return await this.prisma.userStatusCard.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateUserStatusCardInput): Promise<UserStatusCard | null> {
    try {
      return await this.prisma.userStatusCard.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userStatusCard.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}

export class PrismaUserStatusCardDiseaseRepository implements UserStatusCardDiseaseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserStatusCardDisease | null> {
    return await this.prisma.userStatusCardDisease.findUnique({
      where: { id },
    })
  }

  async findByStatusCardId(userStatusCardId: string): Promise<UserStatusCardDisease[]> {
    return await this.prisma.userStatusCardDisease.findMany({
      where: { userStatusCardId },
    })
  }

  async findAll(): Promise<UserStatusCardDisease[]> {
    return await this.prisma.userStatusCardDisease.findMany()
  }

  async create(input: CreateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease> {
    return await this.prisma.userStatusCardDisease.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease | null> {
    try {
      return await this.prisma.userStatusCardDisease.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userStatusCardDisease.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}
