import { z } from '@hono/zod-openapi'

// Helper schemas for OpenAPI
export const HelperSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
  name: z.string().openapi({ example: '佐藤花子' }),
  nickname: z.string().openapi({ example: 'はなちゃん' }),
  phoneNumber: z.string().openapi({ example: '090-1234-5678' }),
  email: z.string().openapi({ example: 'sato@example.com' }),
  relationship: z.string().openapi({ example: '娘' })
}).openapi('Helper')

export const CreateHelperSchema = z.object({
  name: z.string().min(1).openapi({ example: '佐藤花子' }),
  nickname: z.string().min(1).openapi({ example: 'はなちゃん' }),
  phoneNumber: z.string().min(1).openapi({ example: '090-1234-5678' }),
  email: z.string().openapi({ example: 'sato@example.com' }),
  relationship: z.string().min(1).openapi({ example: '娘' })
}).openapi('CreateHelper')

export const UpdateHelperSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: '佐藤花子' }),
  nickname: z.string().min(1).optional().openapi({ example: 'はなちゃん' }),
  phoneNumber: z.string().min(1).optional().openapi({ example: '090-1234-5678' }),
  email: z.string().optional().openapi({ example: 'sato@example.com' }),
  relationship: z.string().min(1).optional().openapi({ example: '娘' })
}).openapi('UpdateHelper')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
