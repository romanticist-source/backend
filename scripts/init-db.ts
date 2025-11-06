import { initDatabase } from '../internal/adapters/gateways/init-db.js'

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/romanticist'

console.log('🚀 Initializing database...')
console.log(`📍 Database URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`)

try {
  await initDatabase(DATABASE_URL)
  console.log('✨ Database initialization completed')
  process.exit(0)
} catch (error) {
  console.error('💥 Database initialization failed:', error)
  process.exit(1)
}
