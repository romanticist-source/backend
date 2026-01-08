import type {
  HelperConnectRepository,
  CreateHelperConnectInput,
  UpdateHelperConnectStatusInput,
  HelperConnectWithDetails
} from '../../domain/helper-connect.js'

export class HelperConnectUseCase {
  constructor(private readonly helperConnectRepository: HelperConnectRepository) {}

  /**
   * User sends connection request to Helper
   */
  async requestConnection(userId: string, helperId: string): Promise<void> {
    // Check if connection already exists
    const existing = await this.helperConnectRepository.findByUserAndHelper(userId, helperId)

    if (existing) {
      if (existing.status === 'pending') {
        throw new Error('既に接続リクエストを送信済みです')
      } else if (existing.status === 'approved') {
        throw new Error('既に接続されています')
      } else if (existing.status === 'rejected') {
        throw new Error('この接続リクエストは拒否されています')
      }
    }

    const input: CreateHelperConnectInput = {
      userId,
      helperId
    }

    await this.helperConnectRepository.create(input)
  }

  /**
   * Helper views pending connection requests
   */
  async getPendingRequests(helperId: string): Promise<HelperConnectWithDetails[]> {
    return await this.helperConnectRepository.findPendingByHelperId(helperId)
  }

  /**
   * Helper approves connection request
   */
  async approveConnection(id: string, helperId: string): Promise<void> {
    const connection = await this.helperConnectRepository.findById(id)

    if (!connection) {
      throw new Error('接続リクエストが見つかりません')
    }

    if (connection.helperId !== helperId) {
      throw new Error('この接続リクエストを承認する権限がありません')
    }

    if (connection.status !== 'pending') {
      throw new Error('この接続リクエストは既に処理されています')
    }

    const input: UpdateHelperConnectStatusInput = {
      status: 'approved'
    }

    await this.helperConnectRepository.updateStatus(id, input)
  }

  /**
   * Helper rejects connection request
   */
  async rejectConnection(id: string, helperId: string): Promise<void> {
    const connection = await this.helperConnectRepository.findById(id)

    if (!connection) {
      throw new Error('接続リクエストが見つかりません')
    }

    if (connection.helperId !== helperId) {
      throw new Error('この接続リクエストを拒否する権限がありません')
    }

    if (connection.status !== 'pending') {
      throw new Error('この接続リクエストは既に処理されています')
    }

    const input: UpdateHelperConnectStatusInput = {
      status: 'rejected'
    }

    await this.helperConnectRepository.updateStatus(id, input)
  }

  /**
   * Get approved connections (for User or Helper)
   */
  async getConnections(userId: string, userRole: 'user' | 'helper'): Promise<HelperConnectWithDetails[]> {
    if (userRole === 'user') {
      return await this.helperConnectRepository.findApprovedByUserId(userId)
    } else {
      return await this.helperConnectRepository.findApprovedByHelperId(userId)
    }
  }

  /**
   * Remove connection (soft delete)
   */
  async removeConnection(id: string, userId: string, userRole: 'user' | 'helper'): Promise<void> {
    const connection = await this.helperConnectRepository.findById(id)

    if (!connection) {
      throw new Error('接続が見つかりません')
    }

    // Verify ownership
    if (userRole === 'user' && connection.userId !== userId) {
      throw new Error('この接続を削除する権限がありません')
    } else if (userRole === 'helper' && connection.helperId !== userId) {
      throw new Error('この接続を削除する権限がありません')
    }

    const success = await this.helperConnectRepository.softDelete(id, userId)

    if (!success) {
      throw new Error('接続の削除に失敗しました')
    }
  }
}
