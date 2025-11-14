import { Hono } from 'hono'
import { PostgresUserRepository } from '../internal/adapters/gateways/postgres-user-repository.js'
import { UserUseCase } from '../internal/application/usecase/user-usecase.js'
import { createUserRouter } from '../internal/router/user-router.js'

const app = new Hono()

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/romanticist'

// Dependency Injection - Wiring up the Hexagonal Architecture
const userRepository = new PostgresUserRepository(DATABASE_URL)
const userUseCase = new UserUseCase(userRepository)
const userRouter = createUserRouter(userUseCase)

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

// Mount user routes
app.route('/users', userRouter)

export default app
