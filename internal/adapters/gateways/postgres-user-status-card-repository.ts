import postgres from 'postgres'
import type { 
  UserStatusCard,
  UserStatusCardRepository,
  CreateUserStatusCardInput,
  UpdateUserStatusCardInput,
  UserStatusCardDisease,
  UserStatusCardDiseaseRepository,
  CreateUserStatusCardDiseaseInput,
  UpdateUserStatusCardDiseaseInput
} from '../../domain/user-status-card.js'

export class PostgresUserStatusCardRepository implements UserStatusCardRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<UserStatusCard | null> {
    const [card] = await this.sql<UserStatusCard[]>`
      SELECT 
        id,
        user_id as "userId",
        blood_type as "bloodType",
        allergy,
        medicine
      FROM user_status_card
      WHERE id = ${id}
    `
    return card || null
  }

  async findByUserId(userId: string): Promise<UserStatusCard | null> {
    const [card] = await this.sql<UserStatusCard[]>`
      SELECT 
        id,
        user_id as "userId",
        blood_type as "bloodType",
        allergy,
        medicine
      FROM user_status_card
      WHERE user_id = ${userId}
    `
    return card || null
  }

  async findAll(): Promise<UserStatusCard[]> {
    return await this.sql<UserStatusCard[]>`
      SELECT 
        id,
        user_id as "userId",
        blood_type as "bloodType",
        allergy,
        medicine
      FROM user_status_card
    `
  }

  async create(input: CreateUserStatusCardInput): Promise<UserStatusCard> {
    const [card] = await this.sql<UserStatusCard[]>`
      INSERT INTO user_status_card (id, user_id, blood_type, allergy, medicine)
      VALUES (uuid_generate_v4()::text, ${input.userId}, ${input.bloodType}, ${input.allergy}, ${input.medicine})
      RETURNING 
        id,
        user_id as "userId",
        blood_type as "bloodType",
        allergy,
        medicine
    `
    return card
  }

  async update(id: string, input: UpdateUserStatusCardInput): Promise<UserStatusCard | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.bloodType !== undefined) updates.blood_type = input.bloodType
    if (input.allergy !== undefined) updates.allergy = input.allergy
    if (input.medicine !== undefined) updates.medicine = input.medicine

    const [card] = await this.sql<UserStatusCard[]>`
      UPDATE user_status_card
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id,
        user_id as "userId",
        blood_type as "bloodType",
        allergy,
        medicine
    `
    return card || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM user_status_card WHERE id = ${id}`
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}

export class PostgresUserStatusCardDiseaseRepository implements UserStatusCardDiseaseRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<UserStatusCardDisease | null> {
    const [disease] = await this.sql<UserStatusCardDisease[]>`
      SELECT 
        id,
        user_status_card_id as "userStatusCardId",
        name
      FROM user_status_card_disease
      WHERE id = ${id}
    `
    return disease || null
  }

  async findByStatusCardId(userStatusCardId: string): Promise<UserStatusCardDisease[]> {
    return await this.sql<UserStatusCardDisease[]>`
      SELECT 
        id,
        user_status_card_id as "userStatusCardId",
        name
      FROM user_status_card_disease
      WHERE user_status_card_id = ${userStatusCardId}
    `
  }

  async findAll(): Promise<UserStatusCardDisease[]> {
    return await this.sql<UserStatusCardDisease[]>`
      SELECT 
        id,
        user_status_card_id as "userStatusCardId",
        name
      FROM user_status_card_disease
    `
  }

  async create(input: CreateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease> {
    const [disease] = await this.sql<UserStatusCardDisease[]>`
      INSERT INTO user_status_card_disease (id, user_status_card_id, name)
      VALUES (uuid_generate_v4()::text, ${input.userStatusCardId}, ${input.name})
      RETURNING 
        id,
        user_status_card_id as "userStatusCardId",
        name
    `
    return disease
  }

  async update(id: string, input: UpdateUserStatusCardDiseaseInput): Promise<UserStatusCardDisease | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.name !== undefined) updates.name = input.name

    const [disease] = await this.sql<UserStatusCardDisease[]>`
      UPDATE user_status_card_disease
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id,
        user_status_card_id as "userStatusCardId",
        name
    `
    return disease || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM user_status_card_disease WHERE id = ${id}`
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
