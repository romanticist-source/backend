import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from '../lib/zod.js'
import type { AlertHistoryUseCase } from '../application/usecase/alert-history-usecase.js'
import { AlertHistorySchema, CreateAlertHistorySchema, UpdateAlertHistorySchema, ErrorSchema } from '../schemas/alert-history-schema.js'
import { LineMessagingUseCase } from '../application/usecase/line-webhook-usecase.js'

// User/Helper Alert History Schemas
const UserAlertHistorySchema = z.object({
  userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  alertId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' }),
  isChecked: z.boolean().openapi({ example: true }),
})

const HelperAlertHistorySchema = z.object({
  helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
  alertId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' }),
  isChecked: z.boolean().openapi({ example: true }),
})

const MessageSchema = z.object({
  message: z.string().openapi({ example: 'Alert marked as checked' }),
})

export function createAlertHistoryRouter(useCase: AlertHistoryUseCase) {
  const router = new OpenAPIHono()

  // GET /alerts - Get all alerts
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Alert History'],
      summary: 'すべてのアラート履歴を取得',
      responses: {
        200: {
          description: 'アラート履歴一覧の取得成功',
          content: { 'application/json': { schema: z.array(AlertHistorySchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const alerts = await useCase.getAllAlerts()
        const formatted = alerts.map(alert => ({
          ...alert,
          createdAt: alert.createdAt.toISOString()
        }))
        return c.json(formatted, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch alerts' }, 500)
      }
    }
  )

  // GET /alerts/:id - Get alert by ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      tags: ['Alert History'],
      summary: 'IDでアラート履歴を取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' })
        })
      },
      responses: {
        200: {
          description: 'アラート履歴の取得成功',
          content: { 'application/json': { schema: AlertHistorySchema } }
        },
        404: {
          description: 'アラート履歴が見つかりません',
          content: { 'application/json': { schema: ErrorSchema } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const alert = await useCase.getAlertById(id)
        
        if (!alert) {
          return c.json({ error: 'Alert not found' }, 404)
        }
        
        return c.json({
          ...alert,
          createdAt: alert.createdAt.toISOString()
        }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch alert' }, 500)
      }
    }
  )

  // GET /alerts/user/:userId - Get alerts by user ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/user/{userId}',
      tags: ['Alert History'],
      summary: 'ユーザーIDでアラート履歴を取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: 'アラート履歴一覧の取得成功',
          content: { 'application/json': { schema: z.array(AlertHistorySchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { userId } = c.req.valid('param')
        const alerts = await useCase.getAlertsByUserId(userId)
        const formatted = alerts.map(alert => ({
          ...alert,
          createdAt: alert.createdAt.toISOString()
        }))
        return c.json(formatted, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch alerts' }, 500)
      }
    }
  )

  // POST /alerts - Create new alert
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      tags: ['Alert History'],
      summary: '新規アラート履歴を作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateAlertHistorySchema } }
        }
      },
      responses: {
        201: {
          description: 'アラート履歴の作成成功',
          content: { 'application/json': { schema: AlertHistorySchema } }
        },
        400: {
          description: 'リクエストが不正です',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const body = c.req.valid('json')
        const alert = await useCase.createAlert(body)
        console.log("🔥 [DEBUG] DB登録完了、LINE送信を開始します");
        
        // c.env または process.env から取得
        const targetId = process.env.LINE_USER_ID || process.env.LINE_USER_ID;
        const token = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_CHANNEL_ACCESS_TOKEN;

        if (targetId && token) {
          const lineUseCase = new LineMessagingUseCase();
          // DBから返ってきた description またはリクエストの description を使用
          const message = alert.description || body.description || "アラートが発生しました";
          
          await lineUseCase.sendPushMessage(
            targetId.trim(),
            message,
            token.trim()
          );
          console.log("🚀 [DEBUG] LINE送信成功");
        } else {
          console.error("❌ [DEBUG] LINEの環境変数が不足しています");
        }
        return c.json({
          ...alert,
          createdAt: alert.createdAt.toISOString()
        }, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create alert'
        return c.json({ error: message }, 400)
      }
    }
  )

  // PUT /alerts/:id - Update alert
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      tags: ['Alert History'],
      summary: 'アラート履歴を更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateAlertHistorySchema } }
        }
      },
      responses: {
        200: {
          description: 'アラート履歴の更新成功',
          content: { 'application/json': { schema: AlertHistorySchema } }
        },
        404: {
          description: 'アラート履歴が見つかりません',
          content: { 'application/json': { schema: ErrorSchema } }
        },
        400: {
          description: 'リクエストが不正です',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const body = c.req.valid('json')
        const alert = await useCase.updateAlert(id, body)
        
        if (!alert) {
          return c.json({ error: 'Alert not found' }, 404)
        }
        
        return c.json({
          ...alert,
          createdAt: alert.createdAt.toISOString()
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update alert'
        return c.json({ error: message }, 400)
      }
    }
  )

  // DELETE /alerts/:id - Delete alert
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      tags: ['Alert History'],
      summary: 'アラート履歴を削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' })
        })
      },
      responses: {
        200: {
          description: 'アラート履歴の削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: 'アラート履歴が見つかりません',
          content: { 'application/json': { schema: ErrorSchema } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const success = await useCase.deleteAlert(id)

        if (!success) {
          return c.json({ error: 'Alert not found' }, 404)
        }

        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete alert' }, 500)
      }
    }
  )

  // GET /alerts/user-history/:userId - Get user alert history
  router.openapi(
    createRoute({
      method: 'get',
      path: '/user-history/{userId}',
      tags: ['Alert History'],
      summary: 'ユーザーの既読履歴を取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: '既読履歴の取得成功',
          content: { 'application/json': { schema: z.array(UserAlertHistorySchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { userId } = c.req.valid('param')
        const history = await useCase.getUserAlertHistory(userId)
        return c.json(history, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch user alert history' }, 500)
      }
    }
  )

  // POST /alerts/:alertHistoryId/check-by-user/:userId - Mark alert as checked by user
  router.openapi(
    createRoute({
      method: 'post',
      path: '/{alertHistoryId}/check-by-user/{userId}',
      tags: ['Alert History'],
      summary: 'ユーザーがアラートを既読にする',
      request: {
        params: z.object({
          alertHistoryId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' }),
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: '既読マークの成功',
          content: { 'application/json': { schema: MessageSchema } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { alertHistoryId, userId } = c.req.valid('param')
        await useCase.markAsCheckedByUser(alertHistoryId, userId)
        return c.json({ message: 'Alert marked as checked by user' }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to mark alert as checked' }, 500)
      }
    }
  )

  // GET /alerts/helper-history/:helperId - Get helper alert history
  router.openapi(
    createRoute({
      method: 'get',
      path: '/helper-history/{helperId}',
      tags: ['Alert History'],
      summary: 'ヘルパーの既読履歴を取得',
      request: {
        params: z.object({
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: '既読履歴の取得成功',
          content: { 'application/json': { schema: z.array(HelperAlertHistorySchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { helperId } = c.req.valid('param')
        const history = await useCase.getHelperAlertHistory(helperId)
        return c.json(history, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch helper alert history' }, 500)
      }
    }
  )

  // POST /alerts/:alertHistoryId/check-by-helper/:helperId - Mark alert as checked by helper
  router.openapi(
    createRoute({
      method: 'post',
      path: '/{alertHistoryId}/check-by-helper/{helperId}',
      tags: ['Alert History'],
      summary: 'ヘルパーがアラートを既読にする',
      request: {
        params: z.object({
          alertHistoryId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174006' }),
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: '既読マークの成功',
          content: { 'application/json': { schema: MessageSchema } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { alertHistoryId, helperId } = c.req.valid('param')
        await useCase.markAsCheckedByHelper(alertHistoryId, helperId)
        return c.json({ message: 'Alert marked as checked by helper' }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to mark alert as checked' }, 500)
      }
    }
  )

  return router
}
