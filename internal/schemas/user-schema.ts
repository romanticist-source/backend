import { z } from '@hono/zod-openapi'

// User schemas for OpenAPI
export const UserSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: '山田太郎' }),
  age: z.number().int().positive().openapi({ example: 65 }),
  mail: z.string().email().openapi({ example: 'yamada@example.com' }),
  address: z.string().nullable().optional().openapi({ example: '東京都渋谷区1-1-1' }),
  comment: z.string().nullable().optional().openapi({ example: '備考欄' }),
  createdAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  isDeleted: z.boolean().openapi({ example: false })
}).openapi('User')

export const CreateUserSchema = z.object({
  name: z.string().min(1).openapi({ example: '山田太郎' }),
  age: z.number().int().positive().openapi({ example: 65 }),
  mail: z.string().email().openapi({ example: 'yamada@example.com' }),
  password: z.string().min(8).openapi({ example: 'password123' }),
  address: z.string().optional().openapi({ example: '東京都渋谷区1-1-1' }),
  comment: z.string().optional().openapi({ example: '備考欄' })
}).openapi('CreateUser')

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: '山田太郎' }),
  age: z.number().int().positive().optional().openapi({ example: 65 }),
  mail: z.string().email().optional().openapi({ example: 'yamada@example.com' }),
  password: z.string().min(8).optional().openapi({ example: 'password123' }),
  address: z.string().optional().openapi({ example: '東京都渋谷区1-1-1' }),
  comment: z.string().optional().openapi({ example: '備考欄' })
}).openapi('UpdateUser')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
