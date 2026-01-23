import { PrismaClient } from "@prisma/client";
import {
  UserFatigue,
  UserFatigueRepository,
  CreateUserFatigueInput,
  UpdateUserFatigueInput,
} from "../../domain/user-fatigue.js";

export class PrismaUserFatigueRepository implements UserFatigueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<UserFatigue[]> {
    const records = await this.prisma.userFatigue.findMany({
      select: {
        id: true,
        userId: true,
        fatigueLevel: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return records;
  }

  async findById(id: string): Promise<UserFatigue | null> {
    const record = await this.prisma.userFatigue.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        fatigueLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return record;
  }

  async findByUserId(userId: string): Promise<UserFatigue[]> {
    const records = await this.prisma.userFatigue.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        fatigueLevel: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return records;
  }

  async create(input: CreateUserFatigueInput): Promise<UserFatigue> {
    const record = await this.prisma.userFatigue.create({
      data: {
        userId: input.userId,
        fatigueLevel: input.fatigueLevel,
      },
      select: {
        id: true,
        userId: true,
        fatigueLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return record;
  }

  async update(
    id: string,
    input: UpdateUserFatigueInput
  ): Promise<UserFatigue | null> {
    try {
      const record = await this.prisma.userFatigue.update({
        where: { id },
        data: {
          ...(input.fatigueLevel !== undefined && {
            fatigueLevel: input.fatigueLevel,
          }),
        },
        select: {
          id: true,
          userId: true,
          fatigueLevel: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return record;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userFatigue.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
