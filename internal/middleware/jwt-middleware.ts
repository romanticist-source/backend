import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  mail: string
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

    // Store user info in context for use in route handlers
    c.set('userId', payload.userId)
    c.set('userMail', payload.mail)

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
