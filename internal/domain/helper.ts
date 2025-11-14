// Domain Entity
export interface Helper {
  id: string
  name: string
  nickname: string
  phoneNumber: string
  email: string
  relationship: string
}

export type CreateHelperInput = Omit<Helper, 'id'>
export type UpdateHelperInput = Partial<Omit<Helper, 'id'>>

// Domain Repository Interface (Port)
export interface HelperRepository {
  findById(id: string): Promise<Helper | null>
  findAll(): Promise<Helper[]>
  findByEmail(email: string): Promise<Helper | null>
  create(input: CreateHelperInput): Promise<Helper>
  update(id: string, input: UpdateHelperInput): Promise<Helper | null>
  delete(id: string): Promise<boolean>
}
