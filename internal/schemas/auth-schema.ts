import { z } from '@hono/zod-openapi'

// User role enum
export const UserRoleSchema = z.enum(['user', 'helper']).openapi('UserRole')

// Login request schema
export const LoginRequestSchema = z.object({
  mail: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(8).openapi({ example: 'password123' })
}).openapi('LoginRequest')

// Login response schema
export const LoginResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  role: UserRoleSchema.openapi({ example: 'user' }),
  user: z.object({
    id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: '山田太郎' }),
    mail: z.string().email().openapi({ example: 'user@example.com' }),
    age: z.number().nullable().optional().openapi({ example: 30 }),
    address: z.string().nullable().optional().openapi({ example: '東京都渋谷区' }),
    comment: z.string().nullable().optional().openapi({ example: 'よろしくお願いします' })
  })
}).openapi('LoginResponse')

// User info response schema (for /auth/me)
export const UserInfoSchema = z.object({
  id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  role: UserRoleSchema.openapi({ example: 'user' }),
  name: z.string().openapi({ example: '山田太郎' }),
  mail: z.string().email().openapi({ example: 'user@example.com' }),
  age: z.number().nullable().optional().openapi({ example: 30 }),
  icon: z.string().nullable().optional().openapi({ example: 'https://example.com/icon.png' }),
  address: z.string().nullable().optional().openapi({ example: '東京都渋谷区' }),
  comment: z.string().nullable().optional().openapi({ example: 'よろしくお願いします' }),
  createdAt: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' })
}).openapi('UserInfo')

// Error schema
export const AuthErrorSchema = z.object({
  errorMessage: z.string().openapi({ example: 'メールアドレスまたはパスワードが正しくありません' })
}).openapi('AuthError')

// Logout response schema
export const LogoutResponseSchema = z.object({
  success: z.boolean().openapi({ example: true })
}).openapi('LogoutResponse')

// Register request schema (for both User and Helper)
export const RegisterRequestSchema = z.object({
  role: UserRoleSchema.openapi({ example: 'user' }),
  name: z.string().min(1).openapi({ example: '山田太郎' }),
  mail: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(8).openapi({ example: 'password123' }),
  age: z.number().int().positive().optional().openapi({ example: 30 }),
  icon: z.string().url().optional().openapi({ example: 'https://example.com/icon.png' }),
  address: z.string().optional().openapi({ example: '東京都渋谷区' }),
  comment: z.string().optional().openapi({ example: 'よろしくお願いします' }),
  // Helper-specific fields (optional, only used when role === 'helper')
  nickname: z.string().min(1).optional().openapi({ example: 'たろうさん' }),
  phoneNumber: z.string().optional().openapi({ example: '090-1234-5678' }),
  relationship: z.string().optional().openapi({ example: '息子' })
}).openapi('RegisterRequest')

// Register response schema (same as LoginResponse)
export const RegisterResponseSchema = LoginResponseSchema.openapi('RegisterResponse')
