import { PrismaClient } from '@prisma/client'
import type { HelperConnectRepository } from '../../domain/helper-connect.js'

export class PrismaHelperConnectRepository implements HelperConnectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserIdsByHelperId(helperId: string): Promise<string[]> {
    const emergencyContacts = await this.prisma.emergencyContact.findMany({
      where: { helperId },
      select: { userId: true },
    })

    return emergencyContacts.map(contact => contact.userId)
  }
}
