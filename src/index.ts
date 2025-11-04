import { Hono } from 'hono'
import { InMemoryArticleRepository } from '../internal/adapters/gateways/in-memory-article-repository.js'
import { ArticleUseCase } from '../internal/application/usecase/article-usecase.js'
import { createArticleRouter } from '../internal/router/article-router.js'

const app = new Hono()

// Dependency Injection - Wiring up the Hexagonal Architecture
const articleRepository = new InMemoryArticleRepository()
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
