// Domain Entity
export interface HelperConnect {
  helperId: string
  userIds: string[]
}

// Domain Repository Interface (Port)
export interface HelperConnectRepository {
  getUserIdsByHelperId(helperId: string): Promise<string[]>
}
