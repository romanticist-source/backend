import postgres from 'postgres'
import type { 
  UserSchedule,
  UserScheduleRepository,
  CreateUserScheduleInput,
  UpdateUserScheduleInput,
  UserRepeatSchedule,
  UserRepeatScheduleRepository,
  CreateUserRepeatScheduleInput,
  UpdateUserRepeatScheduleInput
} from '../../domain/user-schedule.js'

export class PostgresUserScheduleRepository implements UserScheduleRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<UserSchedule | null> {
    const [schedule] = await this.sql<UserSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        is_repeat as "isRepeat",
        start_at as "startAt"
      FROM user_schedule
      WHERE id = ${id}
    `
    return schedule || null
  }

  async findByUserId(userId: string): Promise<UserSchedule[]> {
    return await this.sql<UserSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        is_repeat as "isRepeat",
        start_at as "startAt"
      FROM user_schedule
      WHERE user_id = ${userId}
      ORDER BY start_at DESC
    `
  }

  async findAll(): Promise<UserSchedule[]> {
    return await this.sql<UserSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        is_repeat as "isRepeat",
        start_at as "startAt"
      FROM user_schedule
      ORDER BY start_at DESC
    `
  }

  async create(input: CreateUserScheduleInput): Promise<UserSchedule> {
    const [schedule] = await this.sql<UserSchedule[]>`
      INSERT INTO user_schedule (user_id, title, description, schedule_type, is_repeat, start_at)
      VALUES (${input.userId}, ${input.title}, ${input.description}, ${input.scheduleType}, ${input.isRepeat}, ${input.startAt})
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        is_repeat as "isRepeat",
        start_at as "startAt"
    `
    return schedule
  }

  async update(id: string, input: UpdateUserScheduleInput): Promise<UserSchedule | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.scheduleType !== undefined) updates.schedule_type = input.scheduleType
    if (input.isRepeat !== undefined) updates.is_repeat = input.isRepeat
    if (input.startAt !== undefined) updates.start_at = input.startAt

    const [schedule] = await this.sql<UserSchedule[]>`
      UPDATE user_schedule
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        is_repeat as "isRepeat",
        start_at as "startAt"
    `
    return schedule || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM user_schedule WHERE id = ${id}`
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}

export class PostgresUserRepeatScheduleRepository implements UserRepeatScheduleRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<UserRepeatSchedule | null> {
    const [schedule] = await this.sql<UserRepeatSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        interval,
        schedule_time as "scheduleTime"
      FROM user_repeat_schedule
      WHERE id = ${id}
    `
    return schedule || null
  }

  async findByUserId(userId: string): Promise<UserRepeatSchedule[]> {
    return await this.sql<UserRepeatSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        interval,
        schedule_time as "scheduleTime"
      FROM user_repeat_schedule
      WHERE user_id = ${userId}
      ORDER BY schedule_time
    `
  }

  async findAll(): Promise<UserRepeatSchedule[]> {
    return await this.sql<UserRepeatSchedule[]>`
      SELECT 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        interval,
        schedule_time as "scheduleTime"
      FROM user_repeat_schedule
      ORDER BY schedule_time
    `
  }

  async create(input: CreateUserRepeatScheduleInput): Promise<UserRepeatSchedule> {
    const [schedule] = await this.sql<UserRepeatSchedule[]>`
      INSERT INTO user_repeat_schedule (user_id, title, description, schedule_type, interval, schedule_time)
      VALUES (${input.userId}, ${input.title}, ${input.description}, ${input.scheduleType}, ${input.interval}, ${input.scheduleTime})
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        interval,
        schedule_time as "scheduleTime"
    `
    return schedule
  }

  async update(id: string, input: UpdateUserRepeatScheduleInput): Promise<UserRepeatSchedule | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    const updates: Record<string, any> = {}
    if (input.title !== undefined) updates.title = input.title
    if (input.description !== undefined) updates.description = input.description
    if (input.scheduleType !== undefined) updates.schedule_type = input.scheduleType
    if (input.interval !== undefined) updates.interval = input.interval
    if (input.scheduleTime !== undefined) updates.schedule_time = input.scheduleTime

    const [schedule] = await this.sql<UserRepeatSchedule[]>`
      UPDATE user_repeat_schedule
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING 
        id,
        user_id as "userId",
        title,
        description,
        schedule_type as "scheduleType",
        interval,
        schedule_time as "scheduleTime"
    `
    return schedule || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`DELETE FROM user_repeat_schedule WHERE id = ${id}`
    return result.count > 0
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}
