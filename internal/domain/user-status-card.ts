// Domain Entity
export interface UserStatusCard {
  id: string
  userId: string
  bloodType: string | null
  allergy: string | null
  medicine: string | null
}

export type CreateUserStatusCardInput = Omit<UserStatusCard, 'id'>
export type UpdateUserStatusCardInput = Partial<Omit<UserStatusCard, 'id' | 'userId'>>

export interface UserStatusCardDisease {
  id: string
  userStatusCardId: string
  name: string
}

export type CreateUserStatusCardDiseaseInput = Omit<UserStatusCardDisease, 'id'>
export type UpdateUserStatusCardDiseaseInput = Partial<Omit<UserStatusCardDisease, 'id' | 'userStatusCardId'>>

// Domain Repository Interface (Port)
export interface UserStatusCardRepository {
  findById(id: string): Promise<UserStatusCard | null>
  findByUserId(userId: string): Promise<UserStatusCard | null>
  findAll(): Promise<UserStatusCard[]>
  create(input: CreateUserStatusCardInput): Promise<UserStatusCard>
  update(id: string, input: UpdateUserStatusCardInput): Promise<UserStatusCard | null>
  delete(id: string): Promise<boolean>
}

export interface UserStatusCardDiseaseRepository {
  findById(id: string): Promise<UserStatusCardDisease | null>
  findByStatusCardId(userStatusCardId: string): Promise<UserStatusCardDisease[]>
  findAll(): Promise<UserStatusCardDisease[]>
  create(input: CreateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease>
  update(id: string, input: UpdateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease | null>
  delete(id: string): Promise<boolean>
}
