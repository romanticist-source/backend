// Domain Entity
export interface User {
  id: string
  name: string
  age?: number | null
  mail: string
  icon?: string | null
  address?: string | null
  comment?: string | null
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export type CreateUserInput = Omit<User, 'createdAt' | 'updatedAt' | 'isDeleted'>
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>>

// Domain Repository Interface (Port)
export interface UserRepository {
  findById(id: string): Promise<User | null>
  findAll(includeDeleted?: boolean): Promise<User[]>
  findByMail(mail: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User | null>
  delete(id: string): Promise<boolean>
  softDelete(id: string): Promise<boolean>
  upsertGoogle(input: CreateUserInput): Promise<User>
}
