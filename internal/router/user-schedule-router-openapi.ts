import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { extendZodWithOpenApi } from "@hono/zod-openapi";
import type { UserScheduleUseCase } from '../application/usecase/user-schedule-usecase.js'

// Zodにopenapiメソッドを追加
extendZodWithOpenApi(z);
import { 
  UserScheduleSchema, 
  CreateUserScheduleSchema, 
  UpdateUserScheduleSchema,
  UserRepeatScheduleSchema,
  CreateUserRepeatScheduleSchema,
  UpdateUserRepeatScheduleSchema,
  ErrorSchema 
} from '../schemas/user-schedule-schema.js'

export function createUserScheduleRouter(useCase: UserScheduleUseCase) {
  const router = new OpenAPIHono()

  // Schedule endpoints
  router.openapi(
    createRoute({
      method: 'get',
      path: '/schedules',
      tags: ['User Schedules'],
      summary: 'すべてのスケジュールを取得',
      responses: {
        200: {
          description: 'スケジュール一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserScheduleSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const schedules = await useCase.getAllSchedules()
        const formatted = schedules.map(s => ({
          ...s,
          startAt: s.startAt.toISOString()
        }))
        return c.json(formatted, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch schedules' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/schedules/{id}',
      tags: ['User Schedules'],
      summary: 'IDでスケジュールを取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174004' })
        })
      },
      responses: {
        200: {
          description: 'スケジュールの取得成功',
          content: { 'application/json': { schema: UserScheduleSchema } }
        },
        404: {
          description: 'スケジュールが見つかりません',
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
        const schedule = await useCase.getScheduleById(id)
        
        if (!schedule) {
          return c.json({ error: 'Schedule not found' }, 404)
        }
        
        return c.json({
          ...schedule,
          startAt: schedule.startAt.toISOString()
        }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch schedule' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/schedules/user/{userId}',
      tags: ['User Schedules'],
      summary: 'ユーザーIDでスケジュールを取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: 'スケジュール一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserScheduleSchema) } }
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
        const schedules = await useCase.getSchedulesByUserId(userId)
        const formatted = schedules.map(s => ({
          ...s,
          startAt: s.startAt.toISOString()
        }))
        return c.json(formatted, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch schedules' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'post',
      path: '/schedules',
      tags: ['User Schedules'],
      summary: '新規スケジュールを作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateUserScheduleSchema } }
        }
      },
      responses: {
        201: {
          description: 'スケジュールの作成成功',
          content: { 'application/json': { schema: UserScheduleSchema } }
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
        const scheduleInput = {
          ...body,
          startAt: new Date(body.startAt)
        }
        const schedule = await useCase.createSchedule(scheduleInput)
        return c.json({
          ...schedule,
          startAt: schedule.startAt.toISOString()
        }, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create schedule'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'put',
      path: '/schedules/{id}',
      tags: ['User Schedules'],
      summary: 'スケジュールを更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174004' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateUserScheduleSchema } }
        }
      },
      responses: {
        200: {
          description: 'スケジュールの更新成功',
          content: { 'application/json': { schema: UserScheduleSchema } }
        },
        404: {
          description: 'スケジュールが見つかりません',
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
        
        // startAtがある場合はDateに変換、ない場合は除外
        const { startAt, ...rest } = body
        const scheduleInput = startAt 
          ? { ...rest, startAt: new Date(startAt) }
          : rest
        
        const schedule = await useCase.updateSchedule(id, scheduleInput)
        
        if (!schedule) {
          return c.json({ error: 'Schedule not found' }, 404)
        }
        
        return c.json({
          ...schedule,
          startAt: schedule.startAt.toISOString()
        }, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update schedule'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/schedules/{id}',
      tags: ['User Schedules'],
      summary: 'スケジュールを削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174004' })
        })
      },
      responses: {
        200: {
          description: 'スケジュールの削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: 'スケジュールが見つかりません',
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
        const success = await useCase.deleteSchedule(id)
        
        if (!success) {
          return c.json({ error: 'Schedule not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete schedule' }, 500)
      }
    }
  )

  // Repeat schedule endpoints
  router.openapi(
    createRoute({
      method: 'get',
      path: '/repeat-schedules',
      tags: ['User Repeat Schedules'],
      summary: 'すべての繰り返しスケジュールを取得',
      responses: {
        200: {
          description: '繰り返しスケジュール一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserRepeatScheduleSchema) } }
        },
        500: {
          description: 'サーバーエラー',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }),
    async (c) => {
      try {
        const schedules = await useCase.getAllRepeatSchedules()
        return c.json(schedules, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch repeat schedules' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/repeat-schedules/{id}',
      tags: ['User Repeat Schedules'],
      summary: 'IDで繰り返しスケジュールを取得',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174005' })
        })
      },
      responses: {
        200: {
          description: '繰り返しスケジュールの取得成功',
          content: { 'application/json': { schema: UserRepeatScheduleSchema } }
        },
        404: {
          description: '繰り返しスケジュールが見つかりません',
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
        const schedule = await useCase.getRepeatScheduleById(id)
        
        if (!schedule) {
          return c.json({ error: 'Repeat schedule not found' }, 404)
        }
        
        return c.json(schedule, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch repeat schedule' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'get',
      path: '/repeat-schedules/user/{userId}',
      tags: ['User Repeat Schedules'],
      summary: 'ユーザーIDで繰り返しスケジュールを取得',
      request: {
        params: z.object({
          userId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
        })
      },
      responses: {
        200: {
          description: '繰り返しスケジュール一覧の取得成功',
          content: { 'application/json': { schema: z.array(UserRepeatScheduleSchema) } }
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
        const schedules = await useCase.getRepeatSchedulesByUserId(userId)
        return c.json(schedules, 200)
      } catch (error) {
        return c.json({ error: 'Failed to fetch repeat schedules' }, 500)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'post',
      path: '/repeat-schedules',
      tags: ['User Repeat Schedules'],
      summary: '新規繰り返しスケジュールを作成',
      request: {
        body: {
          content: { 'application/json': { schema: CreateUserRepeatScheduleSchema } }
        }
      },
      responses: {
        201: {
          description: '繰り返しスケジュールの作成成功',
          content: { 'application/json': { schema: UserRepeatScheduleSchema } }
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
        const schedule = await useCase.createRepeatSchedule(body)
        return c.json(schedule, 201)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create repeat schedule'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'put',
      path: '/repeat-schedules/{id}',
      tags: ['User Repeat Schedules'],
      summary: '繰り返しスケジュールを更新',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174005' })
        }),
        body: {
          content: { 'application/json': { schema: UpdateUserRepeatScheduleSchema } }
        }
      },
      responses: {
        200: {
          description: '繰り返しスケジュールの更新成功',
          content: { 'application/json': { schema: UserRepeatScheduleSchema } }
        },
        404: {
          description: '繰り返しスケジュールが見つかりません',
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
        const schedule = await useCase.updateRepeatSchedule(id, body)
        
        if (!schedule) {
          return c.json({ error: 'Repeat schedule not found' }, 404)
        }
        
        return c.json(schedule, 200)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update repeat schedule'
        return c.json({ error: message }, 400)
      }
    }
  )

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/repeat-schedules/{id}',
      tags: ['User Repeat Schedules'],
      summary: '繰り返しスケジュールを削除',
      request: {
        params: z.object({
          id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174005' })
        })
      },
      responses: {
        200: {
          description: '繰り返しスケジュールの削除成功',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean().openapi({ example: true }) })
            }
          }
        },
        404: {
          description: '繰り返しスケジュールが見つかりません',
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
        const success = await useCase.deleteRepeatSchedule(id)
        
        if (!success) {
          return c.json({ error: 'Repeat schedule not found' }, 404)
        }
        
        return c.json({ success: true }, 200)
      } catch (error) {
        return c.json({ error: 'Failed to delete repeat schedule' }, 500)
      }
    }
  )

  return router
}
