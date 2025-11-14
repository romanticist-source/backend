import postgres from 'postgres'
import type { 
  User, 
  UserRepository, 
  CreateUserInput, 
  UpdateUserInput 
} from '../../domain/user.js'

// Infrastructure Layer - PostgreSQL User Repository Implementation
export class PostgresUserRepository implements UserRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.sql<User[]>`
      SELECT 
        id, 
        name, 
        age, 
        mail, 
        password, 
        address, 
        comment, 
        created_at as "createdAt", 
        updated_at as "updatedAt", 
        is_deleted as "isDeleted"
      FROM "user"
      WHERE id = ${id}
    `
    return user || null
  }

  async findAll(includeDeleted = false): Promise<User[]> {
    if (includeDeleted) {
      return await this.sql<User[]>`
        SELECT 
          id, 
          name, 
          age, 
          mail, 
          password, 
          address, 
          comment, 
          created_at as "createdAt", 
          updated_at as "updatedAt", 
          is_deleted as "isDeleted"
        FROM "user"
        ORDER BY created_at DESC
      `
    }

    return await this.sql<User[]>`
      SELECT 
        id, 
        name, 
        age, 
        mail, 
        password, 
        address, 
        comment, 
        created_at as "createdAt", 
        updated_at as "updatedAt", 
        is_deleted as "isDeleted"
      FROM "user"
      WHERE is_deleted = false
      ORDER BY created_at DESC
    `
  }

  async findByMail(mail: string): Promise<User | null> {
    const [user] = await this.sql<User[]>`
      SELECT 
        id, 
        name, 
        age, 
        mail, 
        password, 
        address, 
        comment, 
        created_at as "createdAt", 
        updated_at as "updatedAt", 
        is_deleted as "isDeleted"
      FROM "user"
      WHERE mail = ${mail}
    `
    return user || null
  }

  async create(input: CreateUserInput): Promise<User> {
    const [user] = await this.sql<User[]>`
      INSERT INTO "user" (name, age, mail, password, address, comment)
      VALUES (
        ${input.name}, 
        ${input.age}, 
        ${input.mail}, 
        ${input.password}, 
        ${input.address || null}, 
        ${input.comment || null}
      )
      RETURNING 
        id, 
        name, 
        age, 
        mail, 
        password, 
        address, 
        comment, 
        created_at as "createdAt", 
        updated_at as "updatedAt", 
        is_deleted as "isDeleted"
    `
    return user
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    // Build dynamic SET clause
    const updates: Record<string, any> = { updated_at: this.sql`NOW()` }
    if (input.name !== undefined) updates.name = input.name
    if (input.age !== undefined) updates.age = input.age
    if (input.mail !== undefined) updates.mail = input.mail
    if (input.password !== undefined) updates.password = input.password
    if (input.address !== undefined) updates.address = input.address
    if (input.comment !== undefined) updates.comment = input.comment

    const [user] = await this.sql<User[]>`
      UPDATE "user"
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id, 
        name, 
        age, 
        mail, 
        password, 
        address, 
        comment, 
        created_at as "createdAt", 
        updated_at as "updatedAt", 
        is_deleted as "isDeleted"
    `
    
    return user || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM "user"
      WHERE id = ${id}
    `
    return result.count > 0
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.sql`
      UPDATE "user"
      SET is_deleted = true, updated_at = NOW()
      WHERE id = ${id} AND is_deleted = false
    `
    return result.count > 0
  }

  // Utility method to close the connection
  async close(): Promise<void> {
    await this.sql.end()
  }
}
