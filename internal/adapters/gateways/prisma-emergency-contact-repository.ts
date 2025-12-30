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
      select: {
        userId: true,
        helperId: true,
        name: true,
        relationship: true,
        phoneNumber: true,
        email: true,
        address: true,
        isMain: true,
      },
    })
  }

  async findByHelperId(helperId: string): Promise<EmergencyContact[]> {
    return await this.prisma.emergencyContact.findMany({
      where: { helperId },
      select: {
        userId: true,
        helperId: true,
        name: true,
        relationship: true,
        phoneNumber: true,
        email: true,
        address: true,
        isMain: true,
      },
    })
  }

  async findByUserAndHelper(userId: string, helperId: string): Promise<EmergencyContact | null> {
    return await this.prisma.emergencyContact.findUnique({
      where: {
        userId_helperId: { userId, helperId },
      },
      select: {
        userId: true,
        helperId: true,
        name: true,
        relationship: true,
        phoneNumber: true,
        email: true,
        address: true,
        isMain: true,
      },
    })
  }

  async findAll(): Promise<EmergencyContact[]> {
    return await this.prisma.emergencyContact.findMany({
      select: {
        userId: true,
        helperId: true,
        name: true,
        relationship: true,
        phoneNumber: true,
        email: true,
        address: true,
        isMain: true,
      },
    })
  }

  async create(input: CreateEmergencyContactInput): Promise<EmergencyContact> {
    return await this.prisma.emergencyContact.create({
      data: input,
      select: {
        userId: true,
        helperId: true,
        name: true,
        relationship: true,
        phoneNumber: true,
        email: true,
        address: true,
        isMain: true,
      },
    })
  }

  async update(userId: string, helperId: string, input: UpdateEmergencyContactInput): Promise<EmergencyContact | null> {
    try {
      return await this.prisma.emergencyContact.update({
        where: {
          userId_helperId: { userId, helperId },
        },
        data: input,
        select: {
          userId: true,
          helperId: true,
          name: true,
          relationship: true,
          phoneNumber: true,
          email: true,
          address: true,
          isMain: true,
        },
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
