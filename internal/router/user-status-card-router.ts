import { Hono } from 'hono'
import type { UserStatusCardUseCase } from '../application/usecase/user-status-card-usecase.js'

export function createUserStatusCardRouter(useCase: UserStatusCardUseCase) {
  const router = new Hono()

  // Status Card endpoints
  router.get('/status-cards', async (c) => {
    try {
      const cards = await useCase.getAllStatusCards()
      return c.json(cards)
    } catch (error) {
      return c.json({ error: 'Failed to fetch status cards' }, 500)
    }
  })

  router.get('/status-cards/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const card = await useCase.getStatusCardById(id)
      
      if (!card) {
        return c.json({ error: 'Status card not found' }, 404)
      }
      
      return c.json(card)
    } catch (error) {
      return c.json({ error: 'Failed to fetch status card' }, 500)
    }
  })

  router.get('/status-cards/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const card = await useCase.getStatusCardByUserId(userId)
      
      if (!card) {
        return c.json({ error: 'Status card not found' }, 404)
      }
      
      return c.json(card)
    } catch (error) {
      return c.json({ error: 'Failed to fetch status card' }, 500)
    }
  })

  router.post('/status-cards', async (c) => {
    try {
      const body = await c.req.json()
      const card = await useCase.createStatusCard(body)
      return c.json(card, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create status card'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/status-cards/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const card = await useCase.updateStatusCard(id, body)
      
      if (!card) {
        return c.json({ error: 'Status card not found' }, 404)
      }
      
      return c.json(card)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status card'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/status-cards/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteStatusCard(id)
      
      if (!success) {
        return c.json({ error: 'Status card not found' }, 404)
      }
      
      return c.json({ message: 'Status card deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete status card' }, 500)
    }
  })

  // Disease endpoints
  router.get('/diseases', async (c) => {
    try {
      const diseases = await useCase.getAllDiseases()
      return c.json(diseases)
    } catch (error) {
      return c.json({ error: 'Failed to fetch diseases' }, 500)
    }
  })

  router.get('/diseases/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const disease = await useCase.getDiseaseById(id)
      
      if (!disease) {
        return c.json({ error: 'Disease not found' }, 404)
      }
      
      return c.json(disease)
    } catch (error) {
      return c.json({ error: 'Failed to fetch disease' }, 500)
    }
  })

  router.get('/diseases/status-card/:statusCardId', async (c) => {
    try {
      const statusCardId = c.req.param('statusCardId')
      const diseases = await useCase.getDiseasesByStatusCardId(statusCardId)
      return c.json(diseases)
    } catch (error) {
      return c.json({ error: 'Failed to fetch diseases' }, 500)
    }
  })

  router.post('/diseases', async (c) => {
    try {
      const body = await c.req.json()
      const disease = await useCase.createDisease(body)
      return c.json(disease, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create disease'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/diseases/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const disease = await useCase.updateDisease(id, body)
      
      if (!disease) {
        return c.json({ error: 'Disease not found' }, 404)
      }
      
      return c.json(disease)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update disease'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/diseases/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteDisease(id)
      
      if (!success) {
        return c.json({ error: 'Disease not found' }, 404)
      }
      
      return c.json({ message: 'Disease deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete disease' }, 500)
    }
  })

  return router
}
