import postgres from 'postgres'
import type { 
  EmergencyContact,
  EmergencyContactRepository,
  CreateEmergencyContactInput,
  UpdateEmergencyContactInput
} from '../../domain/emergency-contact.js'

export class PostgresEmergencyContactRepository implements EmergencyContactRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findByUserId(userId: string): Promise<EmergencyContact[]> {
    return await this.sql<EmergencyContact[]>`
      SELECT 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
      FROM emergency_contact
      WHERE user_id = ${userId}
    `
  }

  async findByHelperId(helperId: string): Promise<EmergencyContact[]> {
    return await this.sql<EmergencyContact[]>`
      SELECT 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
      FROM emergency_contact
      WHERE helper_id = ${helperId}
    `
  }

  async findByUserAndHelper(userId: string, helperId: string): Promise<EmergencyContact | null> {
    const [contact] = await this.sql<EmergencyContact[]>`
      SELECT 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
      FROM emergency_contact
      WHERE user_id = ${userId} AND helper_id = ${helperId}
    `
    return contact || null
  }

  async findAll(): Promise<EmergencyContact[]> {
    return await this.sql<EmergencyContact[]>`
      SELECT 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
      FROM emergency_contact
    `
  }

  async create(input: CreateEmergencyContactInput): Promise<EmergencyContact> {
    const [contact] = await this.sql<EmergencyContact[]>`
      INSERT INTO emergency_contact (user_id, helper_id, name, relationship, phone_number, is_main)
      VALUES (${input.userId}, ${input.helperId}, ${input.name}, ${input.relationship}, ${input.phoneNumber}, ${input.isMain})
      RETURNING 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
    `
    return contact
  }

  async update(userId: string, helperId: string, input: UpdateEmergencyContactInput): Promise<EmergencyContact | null> {
    if (Object.keys(input).length === 0) {
      return this.findByUserAndHelper(userId, helperId)
    }

    const updates: Record<string, any> = {}
    if (input.name !== undefined) updates.name = input.name
    if (input.relationship !== undefined) updates.relationship = input.relationship
    if (input.phoneNumber !== undefined) updates.phone_number = input.phoneNumber
    if (input.isMain !== undefined) updates.is_main = input.isMain

    const [contact] = await this.sql<EmergencyContact[]>`
      UPDATE emergency_contact
      SET ${this.sql(updates)}
      WHERE user_id = ${userId} AND helper_id = ${helperId}
      RETURNING 
        user_id as "userId",
        helper_id as "helperId",
        name,
        relationship,
        phone_number as "phoneNumber",
        is_main as "isMain"
    `
    return contact || null
  }

  async delete(userId: string, helperId: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM emergency_contact 
      WHERE user_id = ${userId} AND helper_id = ${helperId}
    `
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
