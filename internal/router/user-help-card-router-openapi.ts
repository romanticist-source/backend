import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from '../lib/zod.js'
import type { UserHelpCardUseCase } from '../application/usecase/user-help-card-usecase.js'
import { UserHelpCardSchema, CreateUserHelpCardSchema, UpdateUserHelpCardSchema, ErrorSchema } from '../schemas/user-help-card-schema.js'

export function createUserHelpCardRouter(useCase: UserHelpCardUseCase) {
  const router = new OpenAPIHono()

  // GET /user-help-cards - Get all help cards
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['User Help Cards'],
      summary: 'すべてのヘルプカードを取得',
      responses: {
        200: {
          description: 'ヘルプカード一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserHelpCardSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const cards = await useCase.getAllHelpCards()
        return c.json(cards, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch help cards' }, 500)
      }
    }
  )

  // GET /user-help-cards/:id - Get help card by ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      tags: ['User Help Cards'],
      summary: 'IDでヘルプカードを取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174007' })
        })
      },
      responses: {
        200: {
          description: 'ヘルプカードの取得成功',
          content: { 'application/json': { schema: UserHelpCardSchema } }
        },
        404: {
          description: 'ヘルプカードが見つかりません',
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
        const card = await useCase.getHelpCardById(id)
        
        if (!card) {
          return c.json({ error: 'Help card not found' }, 404)
        }
        
        return c.json(card, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch help card' }, 500)
      }
    }
  )

  // GET /user-help-cards/user/:userId - Get help card by user ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/user/{userId}',
      tags: ['User Help Cards'],
      summary: 'ユーザーIDでヘルプカードを取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: 'ヘルプカードの取得成功',
          content: { 'application/json': { schema: UserHelpCardSchema } }
        },
        404: {
          description: 'ヘルプカードが見つかりません',
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
        const card = await useCase.getHelpCardByUserId(userId)
        
        if (!card) {
          return c.json({ error: 'Help card not found' }, 404)
        }
        
        return c.json(card, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch help card' }, 500)
      }
    }
  )

  // POST /user-help-cards - Create new help card
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      tags: ['User Help Cards'],
      summary: '新規ヘルプカードを作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateUserHelpCardSchema } }
        }
      },
      responses: {
        201: {
          description: 'ヘルプカードの作成成功',
          content: { 'application/json': { schema: UserHelpCardSchema } }
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
        const card = await useCase.createHelpCard(body)
        return c.json(card, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create help card'
        return c.json({ error: message }, 400)
      }
    }
  )

  // PUT /user-help-cards/:id - Update help card
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      tags: ['User Help Cards'],
      summary: 'ヘルプカードを更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174007' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateUserHelpCardSchema } }
        }
      },
      responses: {
        200: {
          description: 'ヘルプカードの更新成功',
          content: { 'application/json': { schema: UserHelpCardSchema } }
        },
        404: {
          description: 'ヘルプカードが見つかりません',
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
        const card = await useCase.updateHelpCard(id, body)

        if (!card) {
          return c.json({ error: 'Help card not found' }, 404)
        }

        return c.json(card, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update help card'
        return c.json({ error: message }, 400)
      }
    }
  )

  // DELETE /user-help-cards/:id - Delete help card
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      tags: ['User Help Cards'],
      summary: 'ヘルプカードを削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174007' })
        })
      },
      responses: {
        200: {
          description: 'ヘルプカードの削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: 'ヘルプカードが見つかりません',
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
        const success = await useCase.deleteHelpCard(id)
        
        if (!success) {
          return c.json({ error: 'Help card not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete help card' }, 500)
      }
    }
  )

  return router
}
