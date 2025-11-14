import { PrismaClient } from '@prisma/client'
import type {
  Helper,
  HelperRepository,
  CreateHelperInput,
  UpdateHelperInput,
} from '../../domain/helper.js'

export class PrismaHelperRepository implements HelperRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Helper | null> {
    return await this.prisma.helper.findUnique({
      where: { id },
    })
  }

  async findAll(): Promise<Helper[]> {
    return await this.prisma.helper.findMany()
  }

  async findByEmail(email: string): Promise<Helper | null> {
    return await this.prisma.helper.findUnique({
      where: { email },
    })
  }

  async create(input: CreateHelperInput): Promise<Helper> {
    return await this.prisma.helper.create({
      data: input,
    })
  }

  async update(id: string, input: UpdateHelperInput): Promise<Helper | null> {
    try {
      return await this.prisma.helper.update({
        where: { id },
        data: input,
      })
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.helper.delete({
        where: { id },
      })
      return true
    } catch {
      return false
    }
  }
}
