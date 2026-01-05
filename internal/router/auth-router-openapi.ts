import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { AuthUseCase } from '../application/usecase/auth-usecase.js'
import {
  LoginRequestSchema,
  LoginResponseSchema,
  UserInfoSchema,
  AuthErrorSchema,
  LogoutResponseSchema,
  RegisterRequestSchema,
  RegisterResponseSchema
} from '../schemas/auth-schema.js'
import { jwtMiddleware } from '../middleware/jwt-middleware.js'

type Variables = {
  userId: string
  userMail: string
}

export function createAuthRouter(authUseCase: AuthUseCase) {
  const router = new OpenAPIHono<{ Variables: Variables }>()

  // POST /auth/register - Register new user
  router.openapi(
    createRoute({
      method: 'post',
      path: '/register',
      tags: ['Authentication'],
      summary: 'ユーザー登録',
      description: '新規ユーザーを登録し、JWTトークンを発行します',
      request: {
        body: {
          content: { 'application/json': { schema: RegisterRequestSchema } }
        }
      },
      responses: {
        201: {
          description: '登録成功',
          content: { 'application/json': { schema: RegisterResponseSchema } }
        },
        400: {
          description: '登録失敗（既に登録済み、または入力エラー）',
          content: { 'application/json': { schema: AuthErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const body = c.req.valid('json')
        console.log('Register request body:', JSON.stringify(body, null, 2))
        const result = await authUseCase.register(body)

        if (!result) {
          return c.json(
            { errorMessage: 'ユーザー登録に失敗しました' },
            400
          )
        }

        return c.json(result, 201)
      } catch (error) {
        console.error('Register error:', error)
        const message = error instanceof Error ? error.message : 'ユーザー登録に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // POST /auth/login - Login
  router.openapi(
    createRoute({
      method: 'post',
      path: '/login',
      tags: ['Authentication'],
      summary: 'ユーザーログイン',
      description: 'メールアドレスとパスワードで認証し、JWTトークンを発行します',
      request: {
        body: {
          content: { 'application/json': { schema: LoginRequestSchema } }
        }
      },
      responses: {
        200: {
          description: 'ログイン成功',
          content: { 'application/json': { schema: LoginResponseSchema } }
        },
        401: {
          description: '認証失敗',
          content: { 'application/json': { schema: AuthErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { mail, password } = c.req.valid('json')
        const result = await authUseCase.login({ mail, password })

        if (!result) {
          return c.json(
            { errorMessage: 'メールアドレスまたはパスワードが正しくありません' },
            401
          )
        }

        return c.json(result, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'ログインに失敗しました'
        return c.json({ errorMessage: message }, 401)
      }
    }
  )

  // GET /auth/me - Get current user info
  router.use('/me', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'get',
      path: '/me',
      tags: ['Authentication'],
      summary: '認証済みユーザー情報取得',
      description: 'JWTトークンから認証済みユーザーの情報を取得します',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'ユーザー情報取得成功',
          content: { 'application/json': { schema: UserInfoSchema } }
        },
        401: {
          description: '認証トークンが無効',
          content: { 'application/json': { schema: AuthErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const user = await authUseCase.getUserById(userId)

        if (!user) {
          return c.json({ errorMessage: 'ユーザーが見つかりません' }, 401)
        }

        // Convert dates to ISO strings
        return c.json({
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました'
        return c.json({ errorMessage: message }, 401)
      }
    }
  )

  // POST /auth/logout - Logout (optional, client-side token removal)
  router.use('/logout', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'post',
      path: '/logout',
      tags: ['Authentication'],
      summary: 'ログアウト',
      description: 'ログアウト処理（クライアント側でトークンを削除してください）',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'ログアウト成功',
          content: { 'application/json': { schema: LogoutResponseSchema } }
        }
      }
    }),
    async (c) => {
      // In a stateless JWT system, logout is typically handled client-side
      // by removing the token. This endpoint just confirms the action.
      return c.json({ success: true }, 200)
    }
  )

  return router
}
