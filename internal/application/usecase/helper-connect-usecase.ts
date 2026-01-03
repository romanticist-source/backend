import type { HelperConnect, HelperConnectRepository } from '../../domain/helper-connect.js'

export class HelperConnectUseCase {
  constructor(private readonly helperConnectRepository: HelperConnectRepository) {}

  async getUserIdsByHelperId(helperId: string): Promise<HelperConnect> {
    if (!helperId || helperId.trim() === '') {
      throw new Error('Helper ID is required')
    }

    const userIds = await this.helperConnectRepository.getUserIdsByHelperId(helperId)

    return {
      helperId,
      userIds,
    }
  }
}
