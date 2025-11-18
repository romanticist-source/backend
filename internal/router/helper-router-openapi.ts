import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HelperUseCase } from '../application/usecase/helper-usecase.js'
import { HelperSchema, CreateHelperSchema, UpdateHelperSchema, ErrorSchema } from '../schemas/helper-schema.js'

export function createHelperRouter(helperUseCase: HelperUseCase) {
  const router = new OpenAPIHono()

  // GET /helpers - Get all helpers
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Helpers'],
      summary: 'すべてのヘルパーを取得',
      responses: {
        200: {
          description: 'ヘルパー一覧の取得成功',
          content: { 'application/json': { schema: z.array(HelperSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const helpers = await helperUseCase.getAllHelpers()
        return c.json(helpers, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch helpers' }, 500)
      }
    }
  )

  // GET /helpers/:id - Get helper by ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      tags: ['Helpers'],
      summary: 'IDでヘルパーを取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: 'ヘルパーの取得成功',
          content: { 'application/json': { schema: HelperSchema } }
        },
        404: {
          description: 'ヘルパーが見つかりません',
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
        const helper = await helperUseCase.getHelperById(id)
        
        if (!helper) {
          return c.json({ error: 'Helper not found' }, 404)
        }
        
        return c.json(helper, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch helper' }, 500)
      }
    }
  )

  // GET /helpers/email/:email - Get helper by email
  router.openapi(
    createRoute({
      method: 'get',
      path: '/email/{email}',
      tags: ['Helpers'],
      summary: 'メールアドレスでヘルパーを取得',
      request: {
        params: z.object({
          email: z.string().openapi({ example: 'sato@example.com' })
        })
      },
      responses: {
        200: {
          description: 'ヘルパーの取得成功',
          content: { 'application/json': { schema: HelperSchema } }
        },
        404: {
          description: 'ヘルパーが見つかりません',
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
        const { email } = c.req.valid('param')
        const helper = await helperUseCase.getHelperByEmail(email)
        
        if (!helper) {
          return c.json({ error: 'Helper not found' }, 404)
        }
        
        return c.json(helper, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch helper' }, 500)
      }
    }
  )

  // POST /helpers - Create new helper
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      tags: ['Helpers'],
      summary: '新規ヘルパーを作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateHelperSchema } }
        }
      },
      responses: {
        201: {
          description: 'ヘルパーの作成成功',
          content: { 'application/json': { schema: HelperSchema } }
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
        const helper = await helperUseCase.createHelper(body)
        return c.json(helper, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create helper'
        return c.json({ error: message }, 400)
      }
    }
  )

  // PUT /helpers/:id - Update helper
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      tags: ['Helpers'],
      summary: 'ヘルパー情報を更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateHelperSchema } }
        }
      },
      responses: {
        200: {
          description: 'ヘルパーの更新成功',
          content: { 'application/json': { schema: HelperSchema } }
        },
        404: {
          description: 'ヘルパーが見つかりません',
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
        const helper = await helperUseCase.updateHelper(id, body)
        
        if (!helper) {
          return c.json({ error: 'Helper not found' }, 404)
        }
        
        return c.json(helper, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update helper'
        return c.json({ error: message }, 400)
      }
    }
  )

  // DELETE /helpers/:id - Delete helper
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      tags: ['Helpers'],
      summary: 'ヘルパーを削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: 'ヘルパーの削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: 'ヘルパーが見つかりません',
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
        const deleted = await helperUseCase.deleteHelper(id)
        
        if (!deleted) {
          return c.json({ error: 'Helper not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete helper' }, 500)
      }
    }
  )

  return router
}
