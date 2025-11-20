import { PrismaClient } from '@prisma/client'
import type {
  UserSchedule,
  UserScheduleRepository,
  CreateUserScheduleInput,
  UpdateUserScheduleInput,
  UserRepeatSchedule,
  UserRepeatScheduleRepository,
  CreateUserRepeatScheduleInput,
  UpdateUserRepeatScheduleInput,
} from '../../domain/user-schedule.js'

export class PrismaUserScheduleRepository implements UserScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserSchedule | null> {
    return await this.prisma.userSchedule.findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: string): Promise<UserSchedule[]> {
    return await this.prisma.userSchedule.findMany({
      where: { userId },
    })
  }

  async findAll(): Promise<UserSchedule[]> {
    return await this.prisma.userSchedule.findMany()
  }

  async create(input: CreateUserScheduleInput): Promise<UserSchedule> {
    const startAt = input.startAt instanceof Date ? input.startAt : new Date(String(input.startAt))
    return await this.prisma.userSchedule.create({
      data: {
        ...input,
        startAt,
      },
    })
  }

  async update(id: string, input: UpdateUserScheduleInput): Promise<UserSchedule | null> {
    try {
      const data = input.startAt
        ? { ...input, startAt: input.startAt instanceof Date ? input.startAt : new Date(String(input.startAt)) }
        : input
      return await this.prisma.userSchedule.update({
        where: { id },
        data,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userSchedule.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}

export class PrismaUserRepeatScheduleRepository implements UserRepeatScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserRepeatSchedule | null> {
    const schedule = await this.prisma.userRepeatSchedule.findUnique({
      where: { id },
    })
    if (!schedule) return null
    
    return {
      ...schedule,
      scheduleTime: schedule.scheduleTime.toISOString(),
    }
  }

  async findByUserId(userId: string): Promise<UserRepeatSchedule[]> {
    const schedules = await this.prisma.userRepeatSchedule.findMany({
      where: { userId },
    })
    return schedules.map(schedule => ({
      ...schedule,
      scheduleTime: schedule.scheduleTime.toISOString(),
    }))
  }

  async findAll(): Promise<UserRepeatSchedule[]> {
    const schedules = await this.prisma.userRepeatSchedule.findMany()
    return schedules.map(schedule => ({
      ...schedule,
      scheduleTime: schedule.scheduleTime.toISOString(),
    }))
  }

  async create(input: CreateUserRepeatScheduleInput): Promise<UserRepeatSchedule> {
    const schedule = await this.prisma.userRepeatSchedule.create({
      data: {
        ...input,
        scheduleTime: new Date(input.scheduleTime),
      },
    })
    return {
      ...schedule,
      scheduleTime: schedule.scheduleTime.toISOString(),
    }
  }

  async update(id: string, input: UpdateUserRepeatScheduleInput): Promise<UserRepeatSchedule | null> {
    try {
      const schedule = await this.prisma.userRepeatSchedule.update({
        where: { id },
        data: input.scheduleTime 
          ? { ...input, scheduleTime: new Date(input.scheduleTime) }
          : input,
      })
      return {
        ...schedule,
        scheduleTime: schedule.scheduleTime.toISOString(),
      }
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userRepeatSchedule.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}
