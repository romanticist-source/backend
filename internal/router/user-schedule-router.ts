import { Hono } from 'hono'
import type { UserScheduleUseCase } from '../application/usecase/user-schedule-usecase.js'

export function createUserScheduleRouter(useCase: UserScheduleUseCase) {
  const router = new Hono()

  // Schedule endpoints
  router.get('/schedules', async (c) => {
    try {
      const schedules = await useCase.getAllSchedules()
      return c.json(schedules)
    } catch (error) {
      return c.json({ error: 'Failed to fetch schedules' }, 500)
    }
  })

  router.get('/schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const schedule = await useCase.getScheduleById(id)
      
      if (!schedule) {
        return c.json({ error: 'Schedule not found' }, 404)
      }
      
      return c.json(schedule)
    } catch (error) {
      return c.json({ error: 'Failed to fetch schedule' }, 500)
    }
  })

  router.get('/schedules/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const schedules = await useCase.getSchedulesByUserId(userId)
      return c.json(schedules)
    } catch (error) {
      return c.json({ error: 'Failed to fetch schedules' }, 500)
    }
  })

  router.post('/schedules', async (c) => {
    try {
      const body = await c.req.json()
      const schedule = await useCase.createSchedule(body)
      return c.json(schedule, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create schedule'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const schedule = await useCase.updateSchedule(id, body)
      
      if (!schedule) {
        return c.json({ error: 'Schedule not found' }, 404)
      }
      
      return c.json(schedule)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update schedule'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteSchedule(id)
      
      if (!success) {
        return c.json({ error: 'Schedule not found' }, 404)
      }
      
      return c.json({ message: 'Schedule deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete schedule' }, 500)
    }
  })

  // Repeat schedule endpoints
  router.get('/repeat-schedules', async (c) => {
    try {
      const schedules = await useCase.getAllRepeatSchedules()
      return c.json(schedules)
    } catch (error) {
      return c.json({ error: 'Failed to fetch repeat schedules' }, 500)
    }
  })

  router.get('/repeat-schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const schedule = await useCase.getRepeatScheduleById(id)
      
      if (!schedule) {
        return c.json({ error: 'Repeat schedule not found' }, 404)
      }
      
      return c.json(schedule)
    } catch (error) {
      return c.json({ error: 'Failed to fetch repeat schedule' }, 500)
    }
  })

  router.get('/repeat-schedules/user/:userId', async (c) => {
    try {
      const userId = c.req.param('userId')
      const schedules = await useCase.getRepeatSchedulesByUserId(userId)
      return c.json(schedules)
    } catch (error) {
      return c.json({ error: 'Failed to fetch repeat schedules' }, 500)
    }
  })

  router.post('/repeat-schedules', async (c) => {
    try {
      const body = await c.req.json()
      const schedule = await useCase.createRepeatSchedule(body)
      return c.json(schedule, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create repeat schedule'
      return c.json({ error: message }, 400)
    }
  })

  router.put('/repeat-schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const schedule = await useCase.updateRepeatSchedule(id, body)
      
      if (!schedule) {
        return c.json({ error: 'Repeat schedule not found' }, 404)
      }
      
      return c.json(schedule)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update repeat schedule'
      return c.json({ error: message }, 400)
    }
  })

  router.delete('/repeat-schedules/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const success = await useCase.deleteRepeatSchedule(id)
      
      if (!success) {
        return c.json({ error: 'Repeat schedule not found' }, 404)
      }
      
      return c.json({ message: 'Repeat schedule deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete repeat schedule' }, 500)
    }
  })

  return router
}
