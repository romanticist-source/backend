import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { UserRepository } from '../../domain/user.js'

export interface LoginInput {
  mail: string
  password: string
}

export interface LoginResult {
  token: string
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
  name: string
  mail: string
  password: string
  age?: number
  icon?: string
  address?: string
  comment?: string
}

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async login(input: LoginInput): Promise<LoginResult | null> {
    // Find user by email
    const user = await this.userRepository.findByMail(input.mail)

    if (!user) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
      return null
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const token = jwt.sign(
      {
        userId: user.id,
        mail: user.mail
      },
      secret,
      {
        expiresIn: '7d' // Token expires in 7 days
      }
    )

    // Return token and user info (without password)
    return {
      token,
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
    // Check if user already exists
    const existingUser = await this.userRepository.findByMail(input.mail)

    if (existingUser) {
      throw new Error('このメールアドレスは既に登録されています')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10)

    // Generate unique user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

    // Create user
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
        mail: user.mail
      },
      secret,
      {
        expiresIn: '7d'
      }
    )

    // Return token and user info (without password)
    return {
      token,
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
}
