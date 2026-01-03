import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HelperConnectUseCase } from '../application/usecase/helper-connect-usecase.js'
import { HelperConnectSchema, ErrorSchema } from '../schemas/helper-connect-schema.js'

export function createHelperConnectRouter(helperConnectUseCase: HelperConnectUseCase) {
  const router = new OpenAPIHono()

  // GET /helper-connect/:helperId - Get user IDs by helper ID
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{helperId}',
      tags: ['HelperConnect'],
      summary: 'ヘルパーIDから紐付けられたユーザーIDの配列を取得',
      description: 'ヘルパーIDを指定すると、そのヘルパーが担当しているユーザーのIDが配列で返されます',
      request: {
        params: z.object({
          helperId: z.string().openapi({
            example: '123e4567-e89b-12d3-a456-426614174001',
            description: 'ヘルパーのID'
          })
        })
      },
      responses: {
        200: {
          description: 'ユーザーID一覧の取得成功',
          content: { 'application/json': { schema: HelperConnectSchema } }
        },
        400: {
          description: 'リクエストが不正です',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const { helperId } = c.req.valid('param')
        const result = await helperConnectUseCase.getUserIdsByHelperId(helperId)

        return c.json(result, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch user IDs'
        return c.json({ error: message }, 400)
      }
    }
  )

  return router
}
