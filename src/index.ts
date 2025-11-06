import { Hono } from 'hono'
import { PostgresArticleRepository } from '../internal/adapters/gateways/postgres-article-repository.js'
import { ArticleUseCase } from '../internal/application/usecase/article-usecase.js'
import { createArticleRouter } from '../internal/router/article-router.js'

const app = new Hono()

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/romanticist'

// Dependency Injection - Wiring up the Hexagonal Architecture
const articleRepository = new PostgresArticleRepository(DATABASE_URL)
const articleUseCase = new ArticleUseCase(articleRepository)
const articleRouter = createArticleRouter(articleUseCase)

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

// Mount article routes
app.route('/articles', articleRouter)

export default app
