import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import type { UserRole } from '../domain/auth.js'

export interface JwtPayload {
  userId: string
  mail: string
  role?: UserRole // Optional for backward compatibility
}

export async function jwtMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ errorMessage: '認証トークンが必要です' }, 401)
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const payload = jwt.verify(token, secret) as JwtPayload

    // Backward compatibility check: Reject tokens without role field
    if (!payload.role) {
      return c.json({
        errorMessage: '認証情報が古いため、再ログインが必要です'
      }, 401)
    }

    // Store user info in context for use in route handlers
    c.set('userId', payload.userId)
    c.set('userMail', payload.mail)
    c.set('userRole', payload.role)

    await next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return c.json({ errorMessage: 'トークンの有効期限が切れています' }, 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ errorMessage: '認証トークンが無効です' }, 401)
    }
    return c.json({ errorMessage: '認証に失敗しました' }, 401)
  }
}
