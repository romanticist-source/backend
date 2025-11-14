// Domain Entity
export interface UserSchedule {
  id: string
  userId: string
  title: string | null
  description: string | null
  scheduleType: string
  isRepeat: boolean
  startAt: Date
}

export type CreateUserScheduleInput = Omit<UserSchedule, 'id'>
export type UpdateUserScheduleInput = Partial<Omit<UserSchedule, 'id' | 'userId'>>

export interface UserRepeatSchedule {
  id: string
  userId: string
  title: string
  description: string
  scheduleType: string
  interval: number
  scheduleTime: string
}

export type CreateUserRepeatScheduleInput = Omit<UserRepeatSchedule, 'id'>
export type UpdateUserRepeatScheduleInput = Partial<Omit<UserRepeatSchedule, 'id' | 'userId'>>

// Domain Repository Interface (Port)
export interface UserScheduleRepository {
  findById(id: string): Promise<UserSchedule | null>
  findByUserId(userId: string): Promise<UserSchedule[]>
  findAll(): Promise<UserSchedule[]>
  create(input: CreateUserScheduleInput): Promise<UserSchedule>
  update(id: string, input: UpdateUserScheduleInput): Promise<UserSchedule | null>
  delete(id: string): Promise<boolean>
}

export interface UserRepeatScheduleRepository {
  findById(id: string): Promise<UserRepeatSchedule | null>
  findByUserId(userId: string): Promise<UserRepeatSchedule[]>
  findAll(): Promise<UserRepeatSchedule[]>
  create(input: CreateUserRepeatScheduleInput): Promise<UserRepeatSchedule>
  update(id: string, input: UpdateUserRepeatScheduleInput): Promise<UserRepeatSchedule | null>
  delete(id: string): Promise<boolean>
}
