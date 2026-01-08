import { PrismaClient } from '@prisma/client'
import type {
  HelperConnectRepository,
  HelperConnect,
  CreateHelperConnectInput,
  UpdateHelperConnectStatusInput,
  HelperConnectWithDetails
} from '../../domain/helper-connect.js'

export class PrismaHelperConnectRepository implements HelperConnectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<HelperConnect | null> {
    const connection = await this.prisma.helperConnect.findUnique({
      where: { id }
    })

    if (!connection) {
      return null
    }

    return this.mapToEntity(connection)
  }

  async findByUserAndHelper(userId: string, helperId: string): Promise<HelperConnect | null> {
    const connection = await this.prisma.helperConnect.findFirst({
      where: {
        userId,
        helperId,
        isDeleted: false
      }
    })

    if (!connection) {
      return null
    }

    return this.mapToEntity(connection)
  }

  async findPendingByHelperId(helperId: string): Promise<HelperConnectWithDetails[]> {
    const connections = await this.prisma.helperConnect.findMany({
      where: {
        helperId,
        status: 'pending',
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mail: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return connections.map(conn => this.mapToEntityWithDetails(conn))
  }

  async findApprovedByUserId(userId: string): Promise<HelperConnectWithDetails[]> {
    const connections = await this.prisma.helperConnect.findMany({
      where: {
        userId,
        status: 'approved',
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mail: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return connections.map(conn => this.mapToEntityWithDetails(conn))
  }

  async findApprovedByHelperId(helperId: string): Promise<HelperConnectWithDetails[]> {
    const connections = await this.prisma.helperConnect.findMany({
      where: {
        helperId,
        status: 'approved',
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mail: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return connections.map(conn => this.mapToEntityWithDetails(conn))
  }

  async create(input: CreateHelperConnectInput): Promise<HelperConnect> {
    const connection = await this.prisma.helperConnect.create({
      data: {
        userId: input.userId,
        helperId: input.helperId,
        status: 'pending'
      }
    })

    return this.mapToEntity(connection)
  }

  async updateStatus(id: string, input: UpdateHelperConnectStatusInput): Promise<HelperConnect | null> {
    try {
      const connection = await this.prisma.helperConnect.update({
        where: { id },
        data: {
          status: input.status
        }
      })

      return this.mapToEntity(connection)
    } catch (error) {
      return null
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<boolean> {
    try {
      await this.prisma.helperConnect.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy
        }
      })

      return true
    } catch (error) {
      return false
    }
  }

  private mapToEntity(data: any): HelperConnect {
    return {
      id: data.id,
      userId: data.userId,
      helperId: data.helperId,
      status: data.status,
      isDeleted: data.isDeleted,
      deletedAt: data.deletedAt,
      deletedBy: data.deletedBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }

  private mapToEntityWithDetails(data: any): HelperConnectWithDetails {
    return {
      ...this.mapToEntity(data),
      user: data.user ? {
        id: data.user.id,
        name: data.user.name,
        mail: data.user.mail
      } : undefined,
      helper: data.helper ? {
        id: data.helper.id,
        name: data.helper.name,
        email: data.helper.email
      } : undefined
    }
  }
}
