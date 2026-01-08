import { Hono } from 'hono'
import type { LineMessagingUseCase } from '../application/usecase/line-webhook-usecase.js'

export function createLineMessagingRouter(useCase: LineMessagingUseCase) {
  const router = new Hono<{ Bindings: { LINE_CHANNEL_ACCESS_TOKEN: string, LINE_USER_ID: string } }>()

  router.post('/', async (c) => {
    console.log('--- Request Received! ---');
    try {
      const body = await c.req.json()
      const targetId = process.env.LINE_USER_ID
      const { message } = body || "デフォルトメッセージ" // 送信先IDとメッセージをBodyから取得
      const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
      console.log('Body:', body, 'Target ID:', targetId);

      if (!message || !targetId) {
        return c.json({ error: 'userId and message are required' }, 400)
      }

      await useCase.sendPushMessage(
        targetId,
        message,
        token || c.env.LINE_CHANNEL_ACCESS_TOKEN
      )

      return c.json({ success: true, message: 'Message sent successfully' })
    } catch (error) {
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  })

  return router
}