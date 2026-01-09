import { messagingApi } from '@line/bot-sdk'

export class LineMessagingUseCase {
  async sendPushMessage(
    userId: string, 
    message: string, 
    token: string
  ) {
    console.log('Using Token:', token.substring(0, 10) + '...');
    const client = new messagingApi.MessagingApiClient({
      channelAccessToken: token
    })

    try {
      await client.pushMessage({
        to: userId,
        messages: [{ type: 'text', text: String(message) }]
      })
    } catch (error) {
      console.error('LINE Push Error:', error)
      throw new Error('Failed to send LINE message')
    }
  }
}