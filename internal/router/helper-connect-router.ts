import { Hono } from 'hono'
import type { HelperConnectUseCase } from '../application/usecase/helper-connect-usecase.js'

export function createHelperConnectRouter(helperConnectUseCase: HelperConnectUseCase) {
  const router = new Hono()

  // GET /helper-connect/:helperId - Get user IDs by helper ID
  router.get('/:helperId', async (c) => {
    try {
      const helperId = c.req.param('helperId')
      const result = await helperConnectUseCase.getUserIdsByHelperId(helperId)

      return c.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user IDs'
      return c.json({ error: message }, 400)
    }
  })

  return router
}
