import { z , extendZodWithOpenApi } from '@hono/zod-openapi'


extendZodWithOpenApi(z);

// User Status Card schemas for OpenAPI
export const UserStatusCardSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' }),
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  bloodType: z.string().nullable().openapi({ example: 'A型' }),
  allergy: z.string().nullable().openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().openapi({ example: '血圧の薬' }),
  height: z.string().nullable().openapi({ example: '165' }),
  weight: z.string().nullable().openapi({ example: '58' }),
  disability: z.string().nullable().openapi({ example: '軽度の歩行障害' }),
  notes: z.string().nullable().openapi({ example: '長時間の立位は困難' })
}).openapi('UserStatusCard')

export const CreateUserStatusCardSchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  bloodType: z.string().nullable().default(null).openapi({ example: 'A型' }),
  allergy: z.string().nullable().default(null).openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().default(null).openapi({ example: '血圧の薬' }),
  height: z.string().nullable().default(null).openapi({ example: '165' }),
  weight: z.string().nullable().default(null).openapi({ example: '58' }),
  disability: z.string().nullable().default(null).openapi({ example: '軽度の歩行障害' }),
  notes: z.string().nullable().default(null).openapi({ example: '長時間の立位は困難' })
}).openapi('CreateUserStatusCard')

export const UpdateUserStatusCardSchema = z.object({
  bloodType: z.string().nullable().optional().openapi({ example: 'A型' }),
  allergy: z.string().nullable().optional().openapi({ example: '卵、そば' }),
  medicine: z.string().nullable().optional().openapi({ example: '血圧の薬' }),
  height: z.string().nullable().optional().openapi({ example: '165' }),
  weight: z.string().nullable().optional().openapi({ example: '58' }),
  disability: z.string().nullable().optional().openapi({ example: '軽度の歩行障害' }),
  notes: z.string().nullable().optional().openapi({ example: '長時間の立位は困難' })
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
