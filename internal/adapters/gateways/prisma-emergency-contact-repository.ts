import { PrismaClient } from '@prisma/client'
import type {
  EmergencyContact,
  EmergencyContactRepository,
  CreateEmergencyContactInput,
  UpdateEmergencyContactInput,
} from '../../domain/emergency-contact.js'

export class PrismaEmergencyContactRepository implements EmergencyContactRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<EmergencyContact[]> {
    return await this.prisma.emergencyContact.findMany({
      where: { userId },
    })
  }

  async findByHelperId(helperId: string): Promise<EmergencyContact[]> {
    return await this.prisma.emergencyContact.findMany({
      where: { helperId },
    })
  }

  async findByUserAndHelper(userId: string, helperId: string): Promise<EmergencyContact | null> {
    return await this.prisma.emergencyContact.findUnique({
      where: {
        userId_helperId: { userId, helperId },
      },
    })
  }

  async findAll(): Promise<EmergencyContact[]> {
    return await this.prisma.emergencyContact.findMany()
  }

  async create(input: CreateEmergencyContactInput): Promise<EmergencyContact> {
    return await this.prisma.emergencyContact.create({
      data: input,
    })
  }

  async update(userId: string, helperId: string, input: UpdateEmergencyContactInput): Promise<EmergencyContact | null> {
    try {
      return await this.prisma.emergencyContact.update({
        where: {
          userId_helperId: { userId, helperId },
        },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(userId: string, helperId: string): Promise<boolean> {
    try {
      await this.prisma.emergencyContact.delete({
        where: {
          userId_helperId: { userId, helperId },
        },
      })
      return true
    } catch {
      return false
    }
  }
}
