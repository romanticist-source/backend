import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { UserRepository } from '../../domain/user.js'
import type { UserRole } from '../../domain/auth.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LoginInput {
  mail: string
  password: string
}

export interface LoginResult {
  token: string
  role: UserRole
  user: {
    id: string
    name: string
    mail: string
    age: number | null | undefined
    address: string | null | undefined
    comment: string | null | undefined
  }
}

export interface RegisterInput {
  role: UserRole
  name: string
  mail: string
  password: string
  age?: number
  icon?: string
  address?: string
  comment?: string
  // Helper-specific fields
  nickname?: string
  phoneNumber?: string
  relationship?: string
}

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async login(input: LoginInput): Promise<LoginResult | null> {
    // Try to find user first
    const user = await this.userRepository.findByMail(input.mail)

    if (user) {
      // Verify password for user
      const isPasswordValid = await bcrypt.compare(input.password, user.password)

      if (!isPasswordValid) {
        return null
      }

      // Generate JWT token for user
      const secret = process.env.JWT_SECRET
      if (!secret) {
        throw new Error('JWT_SECRET is not configured')
      }

      const token = jwt.sign(
        {
          userId: user.id,
          mail: user.mail,
          role: 'user' as UserRole
        },
        secret,
        {
          expiresIn: '7d'
        }
      )

      return {
        token,
        role: 'user',
        user: {
          id: user.id,
          name: user.name,
          mail: user.mail,
          age: user.age,
          address: user.address,
          comment: user.comment
        }
      }
    }

    // Try to find helper
    const helper = await prisma.helper.findUnique({
      where: { email: input.mail }
    })

    if (!helper) {
      return null
    }

    // Check if helper has password set
    if (!helper.password) {
      throw new Error('パスワードが設定されていません。初回ログイン時にパスワードを設定してください')
    }

    // Verify password for helper
    const isPasswordValid = await bcrypt.compare(input.password, helper.password)

    if (!isPasswordValid) {
      return null
    }

    // Generate JWT token for helper
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const token = jwt.sign(
      {
        userId: helper.id,
        mail: helper.email,
        role: 'helper' as UserRole
      },
      secret,
      {
        expiresIn: '7d'
      }
    )

    return {
      token,
      role: 'helper',
      user: {
        id: helper.id,
        name: helper.name,
        mail: helper.email,
        age: null,
        address: null,
        comment: null
      }
    }
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return null
    }

    // Return user info without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async register(input: RegisterInput): Promise<LoginResult | null> {
    // Global email uniqueness check (both User and Helper tables)
    const existingUser = await this.userRepository.findByMail(input.mail)
    const existingHelper = await prisma.helper.findUnique({
      where: { email: input.mail }
    })

    if (existingUser || existingHelper) {
      throw new Error('このメールアドレスは既に登録されています')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10)

    if (input.role === 'user') {
      // Register as User
      const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

      const user = await this.userRepository.create({
        id: userId,
        name: input.name,
        mail: input.mail,
        password: hashedPassword,
        age: input.age,
        icon: input.icon ?? '',
        address: input.address ?? '',
        comment: input.comment ?? ''
      })

      // Generate JWT token
      const secret = process.env.JWT_SECRET
      if (!secret) {
        throw new Error('JWT_SECRET is not configured')
      }

      const token = jwt.sign(
        {
          userId: user.id,
          mail: user.mail,
          role: 'user' as UserRole
        },
        secret,
        {
          expiresIn: '7d'
        }
      )

      return {
        token,
        role: 'user',
        user: {
          id: user.id,
          name: user.name,
          mail: user.mail,
          age: user.age,
          address: user.address,
          comment: user.comment
        }
      }
    } else {
      // Register as Helper
      if (!input.nickname || !input.phoneNumber || !input.relationship) {
        throw new Error('Helper登録にはnickname, phoneNumber, relationshipが必要です')
      }

      const helper = await prisma.helper.create({
        data: {
          name: input.name,
          nickname: input.nickname,
          phoneNumber: input.phoneNumber,
          email: input.mail,
          password: hashedPassword,
          relationship: input.relationship
        }
      })

      // Generate JWT token
      const secret = process.env.JWT_SECRET
      if (!secret) {
        throw new Error('JWT_SECRET is not configured')
      }

      const token = jwt.sign(
        {
          userId: helper.id,
          mail: helper.email,
          role: 'helper' as UserRole
        },
        secret,
        {
          expiresIn: '7d'
        }
      )

      return {
        token,
        role: 'helper',
        user: {
          id: helper.id,
          name: helper.name,
          mail: helper.email,
          age: null,
          address: null,
          comment: null
        }
      }
    }
  }
}
