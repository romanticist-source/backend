// Domain Entity
export interface EmergencyContact {
  userId: string
  helperId: string
  name: string
  relationship: string
  phoneNumber: string
  email: string | null
  address: string | null
  isMain: boolean
}

export type CreateEmergencyContactInput = EmergencyContact
export type UpdateEmergencyContactInput = Partial<Omit<EmergencyContact, 'userId' | 'helperId'>>

// Domain Repository Interface (Port)
export interface EmergencyContactRepository {
  findByUserId(userId: string): Promise<EmergencyContact[]>
  findByHelperId(helperId: string): Promise<EmergencyContact[]>
  findByUserAndHelper(userId: string, helperId: string): Promise<EmergencyContact | null>
  findAll(): Promise<EmergencyContact[]>
  create(input: CreateEmergencyContactInput): Promise<EmergencyContact>
  update(userId: string, helperId: string, input: UpdateEmergencyContactInput): Promise<EmergencyContact | null>
  delete(userId: string, helperId: string): Promise<boolean>
}
