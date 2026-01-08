import { z } from '../lib/zod.js'

// Request schema: Create connection request (User -> Helper)
export const CreateHelperConnectRequestSchema = z.object({
  helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
}).openapi('CreateHelperConnectRequest')

// Request schema: Approve/Reject connection
export const UpdateHelperConnectStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']).openapi({ example: 'approved' })
}).openapi('UpdateHelperConnectStatus')

// Response schema: HelperConnect entity
export const HelperConnectSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' }),
  userId: z.string().openapi({ example: 'user-001' }),
  helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
  status: z.enum(['pending', 'approved', 'rejected']).openapi({ example: 'pending' }),
  isDeleted: z.boolean().openapi({ example: false }),
  deletedAt: z.string().nullable().openapi({ example: null }),
  deletedBy: z.string().nullable().openapi({ example: null }),
  createdAt: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' })
}).openapi('HelperConnect')

// Response schema: HelperConnect with User/Helper details
export const HelperConnectWithDetailsSchema = HelperConnectSchema.extend({
  user: z.object({
    id: z.string().openapi({ example: 'user-001' }),
    name: z.string().openapi({ example: '山田太郎' }),
    mail: z.string().email().openapi({ example: 'user@example.com' })
  }).optional(),
  helper: z.object({
    id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    name: z.string().openapi({ example: '田中花子' }),
    email: z.string().email().openapi({ example: 'helper@example.com' })
  }).optional()
}).openapi('HelperConnectWithDetails')

// Response schema: Success message
export const HelperConnectSuccessSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: '接続リクエストを送信しました' })
}).openapi('HelperConnectSuccess')

// Response schema: Error
export const HelperConnectErrorSchema = z.object({
  errorMessage: z.string().openapi({ example: 'エラーメッセージ' })
}).openapi('HelperConnectError')

// Response schema: List of connections
export const HelperConnectListSchema = z.object({
  connections: z.array(HelperConnectWithDetailsSchema)
}).openapi('HelperConnectList')
