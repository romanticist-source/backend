import postgres from 'postgres'
import type { 
  Helper, 
  HelperRepository, 
  CreateHelperInput, 
  UpdateHelperInput 
} from '../../domain/helper.js'

export class PostgresHelperRepository implements HelperRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<Helper | null> {
    const [helper] = await this.sql<Helper[]>`
      SELECT 
        id, 
        name, 
        nickname, 
        phone_number as "phoneNumber", 
        email, 
        relationship
      FROM helper
      WHERE id = ${id}
    `
    return helper || null
  }

  async findAll(): Promise<Helper[]> {
    return await this.sql<Helper[]>`
      SELECT 
        id, 
        name, 
        nickname, 
        phone_number as "phoneNumber", 
        email, 
        relationship
      FROM helper
      ORDER BY name
    `
  }

  async findByEmail(email: string): Promise<Helper | null> {
    const [helper] = await this.sql<Helper[]>`
      SELECT 
        id, 
        name, 
        nickname, 
        phone_number as "phoneNumber", 
        email, 
        relationship
      FROM helper
      WHERE email = ${email}
    `
    return helper || null
  }

  async create(input: CreateHelperInput): Promise<Helper> {
    const [helper] = await this.sql<Helper[]>`
      INSERT INTO helper (name, nickname, phone_number, email, relationship)
      VALUES (${input.name}, ${input.nickname}, ${input.phoneNumber}, ${input.email}, ${input.relationship})
      RETURNING 
        id, 
        name, 
        nickname, 
        phone_number as "phoneNumber", 
        email, 
        relationship
    `
    return helper
  }

  async update(id: string, input: UpdateHelperInput): Promise<Helper | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.name !== undefined) updates.name = input.name
    if (input.nickname !== undefined) updates.nickname = input.nickname
    if (input.phoneNumber !== undefined) updates.phone_number = input.phoneNumber
    if (input.email !== undefined) updates.email = input.email
    if (input.relationship !== undefined) updates.relationship = input.relationship

    const [helper] = await this.sql<Helper[]>`
      UPDATE helper
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id, 
        name, 
        nickname, 
        phone_number as "phoneNumber", 
        email, 
        relationship
    `
    
    return helper || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM helper
      WHERE id = ${id}
    `
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
