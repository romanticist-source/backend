import { z } from '@hono/zod-openapi'

// User Status Card schemas for OpenAPI
export const UserStatusCardSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' }),
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  bloodType: z.string().nullable().openapi({ example: 'A型' }),
  allergy: z.string().nullable().openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().openapi({ example: '血圧の薬' })
}).openapi('UserStatusCard')

export const CreateUserStatusCardSchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  bloodType: z.string().nullable().default(null).openapi({ example: 'A型' }),
  allergy: z.string().nullable().default(null).openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().default(null).openapi({ example: '血圧の薬' })
}).openapi('CreateUserStatusCard')

export const UpdateUserStatusCardSchema = z.object({
  bloodType: z.string().nullable().optional().openapi({ example: 'A型' }),
  allergy: z.string().nullable().optional().openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().optional().openapi({ example: '血圧の薬' })
}).openapi('UpdateUserStatusCard')

export const UserStatusCardDiseaseSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174003' }),
  userStatusCardId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' }),
  name: z.string().openapi({ example: '高血圧' })
}).openapi('UserStatusCardDisease')

export const CreateUserStatusCardDiseaseSchema = z.object({
  userStatusCardId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' }),
  name: z.string().min(1).openapi({ example: '高血圧' })
}).openapi('CreateUserStatusCardDisease')

export const UpdateUserStatusCardDiseaseSchema = z.object({
  name: z.string().min(1).openapi({ example: '高血圧' })
}).openapi('UpdateUserStatusCardDisease')

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('Error')
