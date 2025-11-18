import { z } from '@hono/zod-openapi'

// User Help Card schemas for OpenAPI
export const UserHelpCardSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174007' }),
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
}).openapi('UserHelpCard')

export const CreateUserHelpCardSchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
}).openapi('CreateUserHelpCard')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
