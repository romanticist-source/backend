import { Hono } from 'hono'
import type { EmergencyContactUseCase } from '../application/usecase/emergency-contact-usecase.js'

export function createEmergencyContactRouter(useCase: EmergencyContactUseCase) {
  const router = new Hono()

  router.get('/', async (c) => {
    try {
      const contacts = await useCase.getAllEmergencyContacts()
      return c.json(contacts)
    } catch (error) {
      return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
    }
  })

  router.get('/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const contacts = await useCase.getEmergencyContactsByUserId(userId)
      return c.json(contacts)
    } catch (error) {
      return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
    }
  })

  router.get('/helper/:helperId', async (c) => {
    try {
      const helperId = c.req.param('helperId')
      const contacts = await useCase.getEmergencyContactsByHelperId(helperId)
      return c.json(contacts)
    } catch (error) {
      return c.json({ error: 'Failed to fetch emergency contacts' }, 500)
    }
  })

  router.get('/:userId/:helperId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const helperId = c.req.param('helperId')
      const contact = await useCase.getEmergencyContact(userId, helperId)
      
      if (!contact) {
        return c.json({ error: 'Emergency contact not found' }, 404)
      }
      
      return c.json(contact)
    } catch (error) {
      return c.json({ error: 'Failed to fetch emergency contact' }, 500)
    }
  })

  router.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const contact = await useCase.createEmergencyContact(body)
      return c.json(contact, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create emergency contact'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/:userId/:helperId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const helperId = c.req.param('helperId')
      const body = await c.req.json()
      const contact = await useCase.updateEmergencyContact(userId, helperId, body)
      
      if (!contact) {
        return c.json({ error: 'Emergency contact not found' }, 404)
      }
      
      return c.json(contact)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update emergency contact'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/:userId/:helperId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const helperId = c.req.param('helperId')
      const success = await useCase.deleteEmergencyContact(userId, helperId)
      
      if (!success) {
        return c.json({ error: 'Emergency contact not found' }, 404)
      }
      
      return c.json({ message: 'Emergency contact deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete emergency contact' }, 500)
    }
  })

  return router
}
