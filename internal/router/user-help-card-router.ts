import { Hono } from 'hono'
import type { UserHelpCardUseCase } from '../application/usecase/user-help-card-usecase.js'

export function createUserHelpCardRouter(useCase: UserHelpCardUseCase) {
  const router = new Hono()

  router.get('/', async (c) => {
    try {
      const cards = await useCase.getAllHelpCards()
      return c.json(cards)
    } catch (error) {
      return c.json({ error: 'Failed to fetch help cards' }, 500)
    }
  })

  router.get('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const card = await useCase.getHelpCardById(id)
      
      if (!card) {
        return c.json({ error: 'Help card not found' }, 404)
      }
      
      return c.json(card)
    } catch (error) {
      return c.json({ error: 'Failed to fetch help card' }, 500)
    }
  })

  router.get('/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const card = await useCase.getHelpCardByUserId(userId)
      
      if (!card) {
        return c.json({ error: 'Help card not found' }, 404)
      }
      
      return c.json(card)
    } catch (error) {
      return c.json({ error: 'Failed to fetch help card' }, 500)
    }
  })

  router.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const card = await useCase.createHelpCard(body)
      return c.json(card, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create help card'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const card = await useCase.updateHelpCard(id, body)

      if (!card) {
        return c.json({ error: 'Help card not found' }, 404)
      }

      return c.json(card)
    } catch (error) {
      return c.json({ error: 'Failed to update help card' }, 500)
    }
  })

  router.delete('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteHelpCard(id)

      if (!success) {
        return c.json({ error: 'Help card not found' }, 404)
      }

      return c.json({ message: 'Help card deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete help card' }, 500)
    }
  })

  return router
}
