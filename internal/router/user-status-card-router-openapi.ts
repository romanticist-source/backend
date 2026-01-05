import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from '../lib/zod.js'
import type { UserStatusCardUseCase } from '../application/usecase/user-status-card-usecase.js'
import {
  UserStatusCardSchema,
  CreateUserStatusCardSchema,
  UpdateUserStatusCardSchema,
  UserStatusCardDiseaseSchema,
  CreateUserStatusCardDiseaseSchema,
  UpdateUserStatusCardDiseaseSchema,
  ErrorSchema
} from '../schemas/user-status-card-schema.js'

export function createUserStatusCardRouter(useCase: UserStatusCardUseCase) {
  const router = new OpenAPIHono()

  // Status Card endpoints
  router.openapi(
    createRoute({
      method: 'get',
      path: '/status-cards',
      tags: ['User Status Cards'],
      summary: 'すべてのステータスカードを取得',
      responses: {
        200: {
          description: 'ステータスカード一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserStatusCardSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const cards = await useCase.getAllStatusCards()
        return c.json(cards, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch status cards' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/status-cards/{id}',
      tags: ['User Status Cards'],
      summary: 'IDでステータスカードを取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: 'ステータスカードの取得成功',
          content: { 'application/json': { schema: UserStatusCardSchema } }
        },
        404: {
          description: 'ステータスカードが見つかりません',
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
        const card = await useCase.getStatusCardById(id)
        
        if (!card) {
          return c.json({ error: 'Status card not found' }, 404)
        }
        
        return c.json(card, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch status card' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/status-cards/user/{userId}',
      tags: ['User Status Cards'],
      summary: 'ユーザーIDでステータスカードを取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: 'ステータスカードの取得成功',
          content: { 'application/json': { schema: UserStatusCardSchema } }
        },
        404: {
          description: 'ステータスカードが見つかりません',
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
        const { userId } = c.req.valid('param')
        const card = await useCase.getStatusCardByUserId(userId)
        
        if (!card) {
          return c.json({ error: 'Status card not found' }, 404)
        }
        
        return c.json(card, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch status card' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'post',
      path: '/status-cards',
      tags: ['User Status Cards'],
      summary: '新規ステータスカードを作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateUserStatusCardSchema } }
        }
      },
      responses: {
        201: {
          description: 'ステータスカードの作成成功',
          content: { 'application/json': { schema: UserStatusCardSchema } }
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
        const card = await useCase.createStatusCard(body)
        return c.json(card, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create status card'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'put',
      path: '/status-cards/{id}',
      tags: ['User Status Cards'],
      summary: 'ステータスカードを更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateUserStatusCardSchema } }
        }
      },
      responses: {
        200: {
          description: 'ステータスカードの更新成功',
          content: { 'application/json': { schema: UserStatusCardSchema } }
        },
        404: {
          description: 'ステータスカードが見つかりません',
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
        const card = await useCase.updateStatusCard(id, body)
        
        if (!card) {
          return c.json({ error: 'Status card not found' }, 404)
        }
        
        return c.json(card, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update status card'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/status-cards/{id}',
      tags: ['User Status Cards'],
      summary: 'ステータスカードを削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: 'ステータスカードの削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: 'ステータスカードが見つかりません',
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
        const success = await useCase.deleteStatusCard(id)
        
        if (!success) {
          return c.json({ error: 'Status card not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete status card' }, 500)
      }
    }
  )

  // Disease endpoints
  router.openapi(
    createRoute({
      method: 'get',
      path: '/diseases',
      tags: ['User Status Card Diseases'],
      summary: 'すべての病気を取得',
      responses: {
        200: {
          description: '病気一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserStatusCardDiseaseSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const diseases = await useCase.getAllDiseases()
        return c.json(diseases, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch diseases' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/diseases/{id}',
      tags: ['User Status Card Diseases'],
      summary: 'IDで病気を取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174003' })
        })
      },
      responses: {
        200: {
          description: '病気の取得成功',
          content: { 'application/json': { schema: UserStatusCardDiseaseSchema } }
        },
        404: {
          description: '病気が見つかりません',
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
        const disease = await useCase.getDiseaseById(id)
        
        if (!disease) {
          return c.json({ error: 'Disease not found' }, 404)
        }
        
        return c.json(disease, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch disease' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/diseases/status-card/{statusCardId}',
      tags: ['User Status Card Diseases'],
      summary: 'ステータスカードIDで病気を取得',
      request: {
        params: z.object({
          statusCardId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174002' })
        })
      },
      responses: {
        200: {
          description: '病気一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserStatusCardDiseaseSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { statusCardId } = c.req.valid('param')
        const diseases = await useCase.getDiseasesByStatusCardId(statusCardId)
        return c.json(diseases, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch diseases' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'post',
      path: '/diseases',
      tags: ['User Status Card Diseases'],
      summary: '新規病気を作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateUserStatusCardDiseaseSchema } }
        }
      },
      responses: {
        201: {
          description: '病気の作成成功',
          content: { 'application/json': { schema: UserStatusCardDiseaseSchema } }
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
        const disease = await useCase.createDisease(body)
        return c.json(disease, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create disease'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'put',
      path: '/diseases/{id}',
      tags: ['User Status Card Diseases'],
      summary: '病気を更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174003' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateUserStatusCardDiseaseSchema } }
        }
      },
      responses: {
        200: {
          description: '病気の更新成功',
          content: { 'application/json': { schema: UserStatusCardDiseaseSchema } }
        },
        404: {
          description: '病気が見つかりません',
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
        const disease = await useCase.updateDisease(id, body)
        
        if (!disease) {
          return c.json({ error: 'Disease not found' }, 404)
        }
        
        return c.json(disease, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update disease'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/diseases/{id}',
      tags: ['User Status Card Diseases'],
      summary: '病気を削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174003' })
        })
      },
      responses: {
        200: {
          description: '病気の削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: '病気が見つかりません',
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
        const success = await useCase.deleteDisease(id)
        
        if (!success) {
          return c.json({ error: 'Disease not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete disease' }, 500)
      }
    }
  )

  return router
}
