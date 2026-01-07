// Domain Entity
export interface HelperConnect {
  id: string
  userId: string
  helperId: string
  status: 'pending' | 'approved' | 'rejected'
  isDeleted: boolean
  deletedAt: Date | null
  deletedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type CreateHelperConnectInput = {
  userId: string
  helperId: string
}

export type UpdateHelperConnectStatusInput = {
  status: 'approved' | 'rejected'
}

export type HelperConnectWithDetails = HelperConnect & {
  user?: {
    id: string
    name: string
    mail: string
  }
  helper?: {
    id: string
    name: string
    email: string
  }
}

// Domain Repository Interface (Port)
export interface HelperConnectRepository {
  findById(id: string): Promise<HelperConnect | null>
  findByUserAndHelper(userId: string, helperId: string): Promise<HelperConnect | null>
  findPendingByHelperId(helperId: string): Promise<HelperConnectWithDetails[]>
  findApprovedByUserId(userId: string): Promise<HelperConnectWithDetails[]>
  findApprovedByHelperId(helperId: string): Promise<HelperConnectWithDetails[]>
  create(input: CreateHelperConnectInput): Promise<HelperConnect>
  updateStatus(id: string, input: UpdateHelperConnectStatusInput): Promise<HelperConnect | null>
  softDelete(id: string, deletedBy: string): Promise<boolean>
}
