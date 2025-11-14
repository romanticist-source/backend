import type {
  UserScheduleRepository,
  UserRepeatScheduleRepository,
  CreateUserScheduleInput,
  UpdateUserScheduleInput,
  UserSchedule,
  CreateUserRepeatScheduleInput,
  UpdateUserRepeatScheduleInput,
  UserRepeatSchedule,
} from '../../domain/user-schedule.js'

export class UserScheduleUseCase {
  constructor(
    private readonly scheduleRepository: UserScheduleRepository,
    private readonly repeatScheduleRepository: UserRepeatScheduleRepository
  ) {}

  async getAllSchedules(): Promise<UserSchedule[]> {
    return this.scheduleRepository.findAll()
  }

  async getScheduleById(id: string): Promise<UserSchedule | null> {
    return this.scheduleRepository.findById(id)
  }

  async getSchedulesByUserId(userId: string): Promise<UserSchedule[]> {
    return this.scheduleRepository.findByUserId(userId)
  }

  async createSchedule(input: CreateUserScheduleInput): Promise<UserSchedule> {
    if (!input.userId || !input.title) {
      throw new Error('UserId and Title are required')
    }

    return this.scheduleRepository.create(input)
  }

  async updateSchedule(id: string, input: UpdateUserScheduleInput): Promise<UserSchedule | null> {
    return this.scheduleRepository.update(id, input)
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.scheduleRepository.delete(id)
  }

  // Repeat schedule management
  async getAllRepeatSchedules(): Promise<UserRepeatSchedule[]> {
    return this.repeatScheduleRepository.findAll()
  }

  async getRepeatScheduleById(id: string): Promise<UserRepeatSchedule | null> {
    return this.repeatScheduleRepository.findById(id)
  }

  async getRepeatSchedulesByUserId(userId: string): Promise<UserRepeatSchedule[]> {
    return this.repeatScheduleRepository.findByUserId(userId)
  }

  async createRepeatSchedule(input: CreateUserRepeatScheduleInput): Promise<UserRepeatSchedule> {
    if (!input.userId || !input.title || input.interval === undefined) {
      throw new Error('UserId, Title, and Interval are required')
    }

    return this.repeatScheduleRepository.create(input)
  }

  async updateRepeatSchedule(id: string, input: UpdateUserRepeatScheduleInput): Promise<UserRepeatSchedule | null> {
    return this.repeatScheduleRepository.update(id, input)
  }

  async deleteRepeatSchedule(id: string): Promise<boolean> {
    return this.repeatScheduleRepository.delete(id)
  }
}
