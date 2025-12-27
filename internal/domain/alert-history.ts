// Domain Entity
export interface AlertHistory {
  id: string
  userId: string
  title: string
  description: string
  importance: number
  alertType: string
  createdAt: Date
}

export type CreateAlertHistoryInput = Omit<AlertHistory, 'id' | 'createdAt'>
export type UpdateAlertHistoryInput = Partial<Omit<AlertHistory, 'id' | 'userId' | 'createdAt'>>

export interface UserAlertHistory {
  userId: string
  alertId: string
  isChecked: boolean
}

export interface HelperAlertHistory {
  helperId: string
  alertId: string
  isChecked: boolean
}

// Domain Repository Interface (Port)
export interface AlertHistoryRepository {
  findById(id: string): Promise<AlertHistory | null>
  findByUserId(userId: string): Promise<AlertHistory[]>
  findAll(): Promise<AlertHistory[]>
  create(input: CreateAlertHistoryInput): Promise<AlertHistory>
  update(id: string, input: UpdateAlertHistoryInput): Promise<AlertHistory | null>
  delete(id: string): Promise<boolean>
  
  // User alert history operations
  markAsCheckedByUser(alertId: string, userId: string): Promise<boolean>
  getUserAlertHistory(userId: string): Promise<UserAlertHistory[]>

  // Helper alert history operations
  markAsCheckedByHelper(alertId: string, helperId: string): Promise<boolean>
  getHelperAlertHistory(helperId: string): Promise<HelperAlertHistory[]>
}
