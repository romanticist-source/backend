import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HelperConnectUseCase } from '../application/usecase/helper-connect-usecase.js'
import type { UserRole } from '../domain/auth.js'
import {
  CreateHelperConnectRequestSchema,
  UpdateHelperConnectStatusSchema,
  HelperConnectSuccessSchema,
  HelperConnectErrorSchema,
  HelperConnectListSchema
} from '../schemas/helper-connect-schema.js'
import { jwtMiddleware } from '../middleware/jwt-middleware.js'

type Variables = {
  userId: string
  userMail: string
  userRole: UserRole
}

export function createHelperConnectRouter(helperConnectUseCase: HelperConnectUseCase) {
  const router = new OpenAPIHono<{ Variables: Variables }>()

  // POST /helper-connect/request - User sends connection request to Helper
  router.use('/request', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'post',
      path: '/request',
      tags: ['HelperConnect'],
      summary: 'Helper接続リクエスト送信（User→Helper）',
      description: 'UserがHelperに接続リクエストを送信します',
      security: [{ bearerAuth: [] }],
      request: {
        body: {
          content: { 'application/json': { schema: CreateHelperConnectRequestSchema } }
        }
      },
      responses: {
        201: {
          description: 'リクエスト送信成功',
          content: { 'application/json': { schema: HelperConnectSuccessSchema } }
        },
        400: {
          description: 'リクエスト送信失敗',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        403: {
          description: '権限エラー（Userのみ実行可能）',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole

        // Only User can send connection requests
        if (userRole !== 'user') {
          return c.json({ errorMessage: 'この操作はUserのみ実行可能です' }, 403)
        }

        const { helperId } = c.req.valid('json')

        await helperConnectUseCase.requestConnection(userId, helperId)

        return c.json({
          success: true,
          message: '接続リクエストを送信しました'
        }, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : '接続リクエストの送信に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // GET /helper-connect/pending - Helper views pending connection requests
  router.use('/pending', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'get',
      path: '/pending',
      tags: ['HelperConnect'],
      summary: '保留中の接続リクエスト一覧取得（Helper用）',
      description: 'Helperが自分宛ての保留中接続リクエストを取得します',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'リクエスト一覧取得成功',
          content: { 'application/json': { schema: HelperConnectListSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        403: {
          description: '権限エラー（Helperのみ実行可能）',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole

        // Only Helper can view pending requests
        if (userRole !== 'helper') {
          return c.json({ errorMessage: 'この操作はHelperのみ実行可能です' }, 403)
        }

        const connections = await helperConnectUseCase.getPendingRequests(userId)

        // Convert dates to ISO strings
        const formattedConnections = connections.map(conn => ({
          ...conn,
          createdAt: conn.createdAt.toISOString(),
          updatedAt: conn.updatedAt.toISOString(),
          deletedAt: conn.deletedAt ? conn.deletedAt.toISOString() : null
        }))

        return c.json({ connections: formattedConnections }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : '保留中リクエストの取得に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // PATCH /helper-connect/:id/approve - Helper approves connection request
  router.use('/:id/approve', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'patch',
      path: '/{id}/approve',
      tags: ['HelperConnect'],
      summary: '接続リクエスト承認（Helper用）',
      description: 'Helperが接続リクエストを承認します',
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: '承認成功',
          content: { 'application/json': { schema: HelperConnectSuccessSchema } }
        },
        400: {
          description: '承認失敗',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        403: {
          description: '権限エラー（Helperのみ実行可能）',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole
        const { id } = c.req.valid('param')

        // Only Helper can approve
        if (userRole !== 'helper') {
          return c.json({ errorMessage: 'この操作はHelperのみ実行可能です' }, 403)
        }

        await helperConnectUseCase.approveConnection(id, userId)

        return c.json({
          success: true,
          message: '接続リクエストを承認しました'
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : '接続リクエストの承認に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // PATCH /helper-connect/:id/reject - Helper rejects connection request
  router.use('/:id/reject', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'patch',
      path: '/{id}/reject',
      tags: ['HelperConnect'],
      summary: '接続リクエスト拒否（Helper用）',
      description: 'Helperが接続リクエストを拒否します',
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: '拒否成功',
          content: { 'application/json': { schema: HelperConnectSuccessSchema } }
        },
        400: {
          description: '拒否失敗',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        403: {
          description: '権限エラー（Helperのみ実行可能）',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole
        const { id } = c.req.valid('param')

        // Only Helper can reject
        if (userRole !== 'helper') {
          return c.json({ errorMessage: 'この操作はHelperのみ実行可能です' }, 403)
        }

        await helperConnectUseCase.rejectConnection(id, userId)

        return c.json({
          success: true,
          message: '接続リクエストを拒否しました'
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : '接続リクエストの拒否に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // GET /helper-connect/connections - Get approved connections
  router.use('/connections', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'get',
      path: '/connections',
      tags: ['HelperConnect'],
      summary: '承認済み接続一覧取得（User/Helper共通）',
      description: 'UserまたはHelperが自分の承認済み接続一覧を取得します',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: '接続一覧取得成功',
          content: { 'application/json': { schema: HelperConnectListSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole

        const connections = await helperConnectUseCase.getConnections(userId, userRole)

        // Convert dates to ISO strings
        const formattedConnections = connections.map(conn => ({
          ...conn,
          createdAt: conn.createdAt.toISOString(),
          updatedAt: conn.updatedAt.toISOString(),
          deletedAt: conn.deletedAt ? conn.deletedAt.toISOString() : null
        }))

        return c.json({ connections: formattedConnections }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : '接続一覧の取得に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  // DELETE /helper-connect/:id - Remove connection (soft delete)
  router.use('/:id', jwtMiddleware)
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      tags: ['HelperConnect'],
      summary: '接続削除（User/Helper共通）',
      description: 'UserまたはHelperが接続を削除します（論理削除）',
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: '削除成功',
          content: { 'application/json': { schema: HelperConnectSuccessSchema } }
        },
        400: {
          description: '削除失敗',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        },
        401: {
          description: '認証エラー',
          content: { 'application/json': { schema: HelperConnectErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const userId = c.get('userId') as string
        const userRole = c.get('userRole') as UserRole
        const { id } = c.req.valid('param')

        await helperConnectUseCase.removeConnection(id, userId, userRole)

        return c.json({
          success: true,
          message: '接続を削除しました'
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : '接続の削除に失敗しました'
        return c.json({ errorMessage: message }, 400)
      }
    }
  )

  return router
}
