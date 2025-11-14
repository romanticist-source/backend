import { PrismaClient } from '@prisma/client'
import type {
  AlertHistory,
  AlertHistoryRepository,
  CreateAlertHistoryInput,
  UpdateAlertHistoryInput,
  UserAlertHistory,
  HelperAlertHistory,
} from '../../domain/alert-history.js'

export class PrismaAlertHistoryRepository implements AlertHistoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<AlertHistory | null> {
    return await this.prisma.alertHistory.findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: string): Promise<AlertHistory[]> {
    return await this.prisma.alertHistory.findMany({
      where: { userId },
    })
  }

  async findAll(): Promise<AlertHistory[]> {
    return await this.prisma.alertHistory.findMany()
  }

  async create(input: CreateAlertHistoryInput): Promise<AlertHistory> {
    return await this.prisma.alertHistory.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateAlertHistoryInput): Promise<AlertHistory | null> {
    try {
      return await this.prisma.alertHistory.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.alertHistory.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }

  async getUserAlertHistory(userId: string): Promise<UserAlertHistory[]> {
    return await this.prisma.userAlertHistory.findMany({
      where: { userId },
    })
  }

  async markAsCheckedByUser(alertHistoryId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.userAlertHistory.upsert({
        where: {
          userId_alertId: { userId, alertId: alertHistoryId },
        },
        create: {
          userId,
          alertId: alertHistoryId,
          isChecked: true,
        },
        update: {
          isChecked: true,
        },
      })
      return true
    } catch {
      return false
    }
  }

  async getHelperAlertHistory(helperId: string): Promise<HelperAlertHistory[]> {
    return await this.prisma.helperAlertHistory.findMany({
      where: { helperId },
    })
  }

  async markAsCheckedByHelper(alertHistoryId: string, helperId: string): Promise<boolean> {
    try {
      await this.prisma.helperAlertHistory.upsert({
        where: {
          helperId_alertId: { helperId, alertId: alertHistoryId },
        },
        create: {
          helperId,
          alertId: alertHistoryId,
          isChecked: true,
        },
        update: {
          isChecked: true,
        },
      })
      return true
    } catch {
      return false
    }
  }
}
