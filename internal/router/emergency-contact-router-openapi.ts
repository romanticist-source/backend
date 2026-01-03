import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'import { extendZodWithOpenApi } from "@hono/zod-openapi";

// Zodにopenapiメソッドを追加
extendZodWithOpenApi(z);import type { EmergencyContactUseCase } from '../application/usecase/emergency-contact-usecase.js'
import { EmergencyContactSchema, CreateEmergencyContactSchema, UpdateEmergencyContactSchema, ErrorSchema } from '../schemas/emergency-contact-schema.js'

export function createEmergencyContactRouter(useCase: EmergencyContactUseCase) {
  const router = new OpenAPIHono()

  // GET /emergency-contacts - Get all emergency contacts
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Emergency Contacts'],
      summary: 'すべての緊急連絡先を取得',
      responses: {
        200: {
          description: '緊急連絡先一覧の取得成功',
          content: { 'application/json': { schema: z.array(EmergencyContactSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const contacts = await useCase.getAllEmergencyContacts()
        return c.json(contacts, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
      }
    }
  )

  // GET /emergency-contacts/user/:userId - Get emergency contacts by user ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/user/{userId}',
      tags: ['Emergency Contacts'],
      summary: 'ユーザーIDで緊急連絡先を取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: '緊急連絡先一覧の取得成功',
          content: { 'application/json': { schema: z.array(EmergencyContactSchema) } }
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
        const contacts = await useCase.getEmergencyContactsByUserId(userId)
        return c.json(contacts, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
      }
    }
  )

  // GET /emergency-contacts/helper/:helperId - Get emergency contacts by helper ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/helper/{helperId}',
      tags: ['Emergency Contacts'],
      summary: 'ヘルパーIDで緊急連絡先を取得',
      request: {
        params: z.object({
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: '緊急連絡先一覧の取得成功',
          content: { 'application/json': { schema: z.array(EmergencyContactSchema) } }
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
        const contacts = await useCase.getEmergencyContactsByHelperId(helperId)
        return c.json(contacts, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
      }
    }
  )

  // GET /emergency-contacts/:userId/:helperId - Get specific emergency contact
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{userId}/{helperId}',
      tags: ['Emergency Contacts'],
      summary: '特定の緊急連絡先を取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: '緊急連絡先の取得成功',
          content: { 'application/json': { schema: EmergencyContactSchema } }
        },
        404: {
          description: '緊急連絡先が見つかりません',
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
        const { userId, helperId } = c.req.valid('param')
        const contact = await useCase.getEmergencyContact(userId, helperId)
        
        if (!contact) {
          return c.json({ error: 'Emergency contact not found' }, 404)
        }
        
        return c.json(contact, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch emergency contact' }, 500)
      }
    }
  )

  // POST /emergency-contacts - Create new emergency contact
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      tags: ['Emergency Contacts'],
      summary: '新規緊急連絡先を作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateEmergencyContactSchema } }
        }
      },
      responses: {
        201: {
          description: '緊急連絡先の作成成功',
          content: { 'application/json': { schema: EmergencyContactSchema } }
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
        const contactInput = {
          ...body,
          email: body.email ?? null,
          address: body.address ?? null
        }
        const contact = await useCase.createEmergencyContact(contactInput)
        return c.json(contact, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create emergency contact'
        return c.json({ error: message }, 400)
      }
    }
  )

  // PUT /emergency-contacts/:userId/:helperId - Update emergency contact
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{userId}/{helperId}',
      tags: ['Emergency Contacts'],
      summary: '緊急連絡先を更新',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateEmergencyContactSchema } }
        }
      },
      responses: {
        200: {
          description: '緊急連絡先の更新成功',
          content: { 'application/json': { schema: EmergencyContactSchema } }
        },
        404: {
          description: '緊急連絡先が見つかりません',
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
        const { userId, helperId } = c.req.valid('param')
        const body = c.req.valid('json')
        const contact = await useCase.updateEmergencyContact(userId, helperId, body)
        
        if (!contact) {
          return c.json({ error: 'Emergency contact not found' }, 404)
        }
        
        return c.json(contact, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update emergency contact'
        return c.json({ error: message }, 400)
      }
    }
  )

  // DELETE /emergency-contacts/:userId/:helperId - Delete emergency contact
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{userId}/{helperId}',
      tags: ['Emergency Contacts'],
      summary: '緊急連絡先を削除',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
          helperId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' })
        })
      },
      responses: {
        200: {
          description: '緊急連絡先の削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: '緊急連絡先が見つかりません',
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
        const { userId, helperId } = c.req.valid('param')
        const deleted = await useCase.deleteEmergencyContact(userId, helperId)
        
        if (!deleted) {
          return c.json({ error: 'Emergency contact not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete emergency contact' }, 500)
      }
    }
  )

  return router
}
