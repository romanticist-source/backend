import { PrismaClient } from '@prisma/client'
import { seed } from './seed.js'

console.log('🚀 Initializing database with Prisma...')

const prisma = new PrismaClient()

try {
  // Test database connection
  await prisma.$connect()
  console.log('✅ Database connection successful')

  // Run seed
  await seed(prisma)

  console.log('✨ Database initialization completed')

  await prisma.$disconnect()
  process.exit(0)
} catch (error) {
  console.error('💥 Database initialization failed:', error)
  await prisma.$disconnect()
  process.exit(1)
}
