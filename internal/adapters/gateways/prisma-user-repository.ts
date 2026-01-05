import { PrismaClient } from "@prisma/client";
import type {
  User,
  UserRepository,
  CreateUserInput,
  UpdateUserInput,
} from "../../domain/user.js";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        age: true,
        mail: true,
        password: true,
        icon: true,
        address: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
    return user;
  }

  async findAll(includeDeleted = false): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: includeDeleted ? {} : { isDeleted: false },
      select: {
        id: true,
        name: true,
        age: true,
        mail: true,
        password: true,
        icon: true,
        address: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }

  async findByMail(mail: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { mail },
      select: {
        id: true,
        name: true,
        age: true,
        mail: true,
        password: true,
        icon: true,
        address: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
    return user;
  }

  async create(input: CreateUserInput): Promise<User> {
    return await this.prisma.user.create({
      data: input,
      select: {
        id: true,
        name: true,
        age: true,
        mail: true,
        password: true,
        icon: true,
        address: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: input,
        select: {
          id: true,
          name: true,
          age: true,
          mail: true,
          password: true,
          icon: true,
          address: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          isDeleted: true,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      return true;
    } catch {
      return false;
    }
  }

  async upsertGoogle(input: CreateUserInput): Promise<User> {
    if (!input.id || !input.mail || !input.name) {
      throw new Error("Invalid Google payload");
    }

    return await this.prisma.user.upsert({
      where: { id: input.id },
      update: {
        name: input.name,
        mail: input.mail,
        icon: input.icon,
        address: input.address,
        comment: input.comment,
        isDeleted: false, // ログイン時に復活させたい場合
      },
      create: {
        id: input.id,
        name: input.name,
        mail: input.mail,
        password: input.password,
        icon: input.icon,
        address: input.address,
        comment: input.comment,
      },
      select: {
        id: true,
        name: true,
        age: true,
        mail: true,
        password: true,
        icon: true,
        address: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }
}
