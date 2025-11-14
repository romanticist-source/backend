// Domain Entity
export interface UserHelpCard {
  id: string
  userId: string
}

export type CreateUserHelpCardInput = Omit<UserHelpCard, 'id'>

// Domain Repository Interface (Port)
export interface UserHelpCardRepository {
  findById(id: string): Promise<UserHelpCard | null>
  findByUserId(userId: string): Promise<UserHelpCard | null>
  findAll(): Promise<UserHelpCard[]>
  create(input: CreateUserHelpCardInput): Promise<UserHelpCard>
  delete(id: string): Promise<boolean>
}
