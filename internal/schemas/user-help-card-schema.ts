import { z } from '@hono/zod-openapi'

// User Help Card schemas for OpenAPI
export const UserHelpCardSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174007' }),
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  hospitalName: z.string().nullable().openapi({ example: 'サンプル病院' }),
  hospitalPhone: z.string().nullable().openapi({ example: '03-1234-5678' })
}).openapi('UserHelpCard')

export const CreateUserHelpCardSchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  hospitalName: z.string().nullable().default(null).openapi({ example: 'サンプル病院' }),
  hospitalPhone: z.string().nullable().default(null).openapi({ example: '03-1234-5678' })
}).openapi('CreateUserHelpCard')

export const UpdateUserHelpCardSchema = z.object({
  hospitalName: z.string().nullable().optional().openapi({ example: 'サンプル病院' }),
  hospitalPhone: z.string().nullable().optional().openapi({ example: '03-1234-5678' })
}).openapi('UpdateUserHelpCard')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
