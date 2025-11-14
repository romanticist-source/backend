import postgres from 'postgres'
import type { 
  UserHelpCard,
  UserHelpCardRepository,
  CreateUserHelpCardInput
} from '../../domain/user-help-card.js'

export class PostgresUserHelpCardRepository implements UserHelpCardRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<UserHelpCard | null> {
    const [card] = await this.sql<UserHelpCard[]>`
      SELECT 
        id,
        user_id as "userId"
      FROM user_help_card
      WHERE id = ${id}
    `
    return card || null
  }

  async findByUserId(userId: string): Promise<UserHelpCard | null> {
    const [card] = await this.sql<UserHelpCard[]>`
      SELECT 
        id,
        user_id as "userId"
      FROM user_help_card
      WHERE user_id = ${userId}
    `
    return card || null
  }

  async findAll(): Promise<UserHelpCard[]> {
    return await this.sql<UserHelpCard[]>`
      SELECT 
        id,
        user_id as "userId"
      FROM user_help_card
    `
  }

  async create(input: CreateUserHelpCardInput): Promise<UserHelpCard> {
    const [card] = await this.sql<UserHelpCard[]>`
      INSERT INTO user_help_card (id, user_id)
      VALUES (uuid_generate_v4()::text, ${input.userId})
      RETURNING 
        id,
        user_id as "userId"
    `
    return card
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM user_help_card WHERE id = ${id}`
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
