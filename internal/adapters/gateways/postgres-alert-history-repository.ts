import postgres from 'postgres'
import type { 
  AlertHistory,
  AlertHistoryRepository,
  CreateAlertHistoryInput,
  UpdateAlertHistoryInput,
  UserAlertHistory,
  HelperAlertHistory
} from '../../domain/alert-history.js'

export class PostgresAlertHistoryRepository implements AlertHistoryRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<AlertHistory | null> {
    const [alert] = await this.sql<AlertHistory[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        importance,
        alert_type as "alertType",
        created_at as "createdAt"
      FROM alert_history
      WHERE id = ${id}
    `
    return alert || null
  }

  async findByUserId(userId: string): Promise<AlertHistory[]> {
    return await this.sql<AlertHistory[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        importance,
        alert_type as "alertType",
        created_at as "createdAt"
      FROM alert_history
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
  }

  async findAll(): Promise<AlertHistory[]> {
    return await this.sql<AlertHistory[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        importance,
        alert_type as "alertType",
        created_at as "createdAt"
      FROM alert_history
      ORDER BY created_at DESC
    `
  }

  async create(input: CreateAlertHistoryInput): Promise<AlertHistory> {
    const [alert] = await this.sql<AlertHistory[]>`
      INSERT INTO alert_history (user_id, title, description, importance, alert_type)
      VALUES (${input.userId}, ${input.title}, ${input.description}, ${input.importance}, ${input.alertType})
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        importance,
        alert_type as "alertType",
        created_at as "createdAt"
    `
    return alert
  }

  async update(id: string, input: UpdateAlertHistoryInput): Promise<AlertHistory | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.importance !== undefined) updates.importance = input.importance
    if (input.alertType !== undefined) updates.alert_type = input.alertType

    const [alert] = await this.sql<AlertHistory[]>`
      UPDATE alert_history
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        importance,
        alert_type as "alertType",
        created_at as "createdAt"
    `
    return alert || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM alert_history WHERE id = ${id}`
    return result.count > 0
  }

  async markAsCheckedByUser(userId: string, alertId: string): Promise<boolean> {
    const result = await this.sql`
      INSERT INTO user_alert_history (user_id, alert_id, is_checked)
      VALUES (${userId}, ${alertId}, true)
      ON CONFLICT (user_id, alert_id) 
      DO UPDATE SET is_checked = true
    `
    return result.count > 0
  }

  async getUserAlertHistory(userId: string): Promise<UserAlertHistory[]> {
    return await this.sql<UserAlertHistory[]>`
      SELECT 
        user_id as "userId",
        alert_id as "alertId",
        is_checked as "isChecked"
      FROM user_alert_history
      WHERE user_id = ${userId}
    `
  }

  async markAsCheckedByHelper(helperId: string, alertId: string): Promise<boolean> {
    const result = await this.sql`
      INSERT INTO helper_alert_history (helper_id, alert_id, is_checked)
      VALUES (${helperId}, ${alertId}, true)
      ON CONFLICT (helper_id, alert_id)
      DO UPDATE SET is_checked = true
    `
    return result.count > 0
  }

  async getHelperAlertHistory(helperId: string): Promise<HelperAlertHistory[]> {
    return await this.sql<HelperAlertHistory[]>`
      SELECT 
        helper_id as "helperId",
        alert_id as "alertId",
        is_checked as "isChecked"
      FROM helper_alert_history
      WHERE helper_id = ${helperId}
    `
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
