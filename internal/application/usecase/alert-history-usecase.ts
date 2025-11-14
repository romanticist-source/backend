import type {
  AlertHistoryRepository,
  CreateAlertHistoryInput,
  UpdateAlertHistoryInput,
  AlertHistory,
  UserAlertHistory,
  HelperAlertHistory,
} from '../../domain/alert-history.js'

export class AlertHistoryUseCase {
  constructor(private readonly repository: AlertHistoryRepository) {}

  async getAllAlerts(): Promise<AlertHistory[]> {
    return this.repository.findAll()
  }

  async getAlertById(id: string): Promise<AlertHistory | null> {
    return this.repository.findById(id)
  }

  async getAlertsByUserId(userId: string): Promise<AlertHistory[]> {
    return this.repository.findByUserId(userId)
  }

  async createAlert(input: CreateAlertHistoryInput): Promise<AlertHistory> {
    if (!input.userId || !input.title) {
      throw new Error('UserId and Title are required')
    }

    return this.repository.create(input)
  }

  async updateAlert(id: string, input: UpdateAlertHistoryInput): Promise<AlertHistory | null> {
    return this.repository.update(id, input)
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }

  // User alert history
  async getUserAlertHistory(userId: string): Promise<UserAlertHistory[]> {
    return this.repository.getUserAlertHistory(userId)
  }

  async markAsCheckedByUser(alertHistoryId: string, userId: string): Promise<void> {
    await this.repository.markAsCheckedByUser(alertHistoryId, userId)
  }

  // Helper alert history
  async getHelperAlertHistory(helperId: string): Promise<HelperAlertHistory[]> {
    return this.repository.getHelperAlertHistory(helperId)
  }

  async markAsCheckedByHelper(alertHistoryId: string, helperId: string): Promise<void> {
    await this.repository.markAsCheckedByHelper(alertHistoryId, helperId)
  }
}
