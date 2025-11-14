import { Hono } from 'hono'
import type { AlertHistoryUseCase } from '../application/usecase/alert-history-usecase.js'

export function createAlertHistoryRouter(useCase: AlertHistoryUseCase) {
  const router = new Hono()

  router.get('/', async (c) => {
    try {
      const alerts = await useCase.getAllAlerts()
      return c.json(alerts)
    } catch (error) {
      return c.json({ error: 'Failed to fetch alerts' }, 500)
    }
  })

  router.get('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const alert = await useCase.getAlertById(id)
      
      if (!alert) {
        return c.json({ error: 'Alert not found' }, 404)
      }
      
      return c.json(alert)
    } catch (error) {
      return c.json({ error: 'Failed to fetch alert' }, 500)
    }
  })

  router.get('/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const alerts = await useCase.getAlertsByUserId(userId)
      return c.json(alerts)
    } catch (error) {
      return c.json({ error: 'Failed to fetch alerts' }, 500)
    }
  })

  router.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const alert = await useCase.createAlert(body)
      return c.json(alert, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create alert'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const alert = await useCase.updateAlert(id, body)
      
      if (!alert) {
        return c.json({ error: 'Alert not found' }, 404)
      }
      
      return c.json(alert)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update alert'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteAlert(id)
      
      if (!success) {
        return c.json({ error: 'Alert not found' }, 404)
      }
      
      return c.json({ message: 'Alert deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete alert' }, 500)
    }
  })

  // User alert history
  router.get('/user-history/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const history = await useCase.getUserAlertHistory(userId)
      return c.json(history)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user alert history' }, 500)
    }
  })

  router.post('/:alertHistoryId/check-by-user/:userId', async (c) => {
    try {
      const alertHistoryId = c.req.param('alertHistoryId')
      const userId = c.req.param('userId')
      await useCase.markAsCheckedByUser(alertHistoryId, userId)
      return c.json({ message: 'Alert marked as checked by user' })
    } catch (error) {
      return c.json({ error: 'Failed to mark alert as checked' }, 500)
    }
  })

  // Helper alert history
  router.get('/helper-history/:helperId', async (c) => {
    try {
      const helperId = c.req.param('helperId')
      const history = await useCase.getHelperAlertHistory(helperId)
      return c.json(history)
    } catch (error) {
      return c.json({ error: 'Failed to fetch helper alert history' }, 500)
    }
  })

  router.post('/:alertHistoryId/check-by-helper/:helperId', async (c) => {
    try {
      const alertHistoryId = c.req.param('alertHistoryId')
      const helperId = c.req.param('helperId')
      await useCase.markAsCheckedByHelper(alertHistoryId, helperId)
      return c.json({ message: 'Alert marked as checked by helper' })
    } catch (error) {
      return c.json({ error: 'Failed to mark alert as checked' }, 500)
    }
  })

  return router
}
