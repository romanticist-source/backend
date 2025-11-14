import { Hono } from 'hono'
import type { HelperUseCase } from '../application/usecase/helper-usecase.js'

export function createHelperRouter(helperUseCase: HelperUseCase) {
  const router = new Hono()

  router.get('/', async (c) => {
    try {
      const helpers = await helperUseCase.getAllHelpers()
      return c.json(helpers)
    } catch (error) {
      return c.json({ error: 'Failed to fetch helpers' }, 500)
    }
  })

  router.get('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const helper = await helperUseCase.getHelperById(id)
      
      if (!helper) {
        return c.json({ error: 'Helper not found' }, 404)
      }
      
      return c.json(helper)
    } catch (error) {
      return c.json({ error: 'Failed to fetch helper' }, 500)
    }
  })

  router.get('/email/:email', async (c) => {
    try {
      const email = c.req.param('email')
      const helper = await helperUseCase.getHelperByEmail(email)
      
      if (!helper) {
        return c.json({ error: 'Helper not found' }, 404)
      }
      
      return c.json(helper)
    } catch (error) {
      return c.json({ error: 'Failed to fetch helper' }, 500)
    }
  })

  router.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const helper = await helperUseCase.createHelper(body)
      return c.json(helper, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create helper'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const helper = await helperUseCase.updateHelper(id, body)
      
      if (!helper) {
        return c.json({ error: 'Helper not found' }, 404)
      }
      
      return c.json(helper)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update helper'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const deleted = await helperUseCase.deleteHelper(id)
      
      if (!deleted) {
        return c.json({ error: 'Helper not found' }, 404)
      }
      
      return c.json({ message: 'Helper deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete helper' }, 500)
    }
  })

  return router
}
