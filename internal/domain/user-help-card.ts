// Domain Entity
export interface UserHelpCard {
  id: string
  userId: string
  hospitalName: string | null
  hospitalPhone: string | null
}

export type CreateUserHelpCardInput = Omit<UserHelpCard, 'id'>
export type UpdateUserHelpCardInput = Partial<Omit<UserHelpCard, 'id' | 'userId'>>

// Domain Repository Interface (Port)
export interface UserHelpCardRepository {
  findById(id: string): Promise<UserHelpCard | null>
  findByUserId(userId: string): Promise<UserHelpCard | null>
  findAll(): Promise<UserHelpCard[]>
  create(input: CreateUserHelpCardInput): Promise<UserHelpCard>
  update(id: string, input: UpdateUserHelpCardInput): Promise<UserHelpCard | null>
  delete(id: string): Promise<boolean>
}
