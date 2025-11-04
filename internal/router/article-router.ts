import { Hono } from 'hono'
import type { ArticleUseCase } from '../application/usecase/article-usecase.js'

// Presentation Layer - HTTP Router (Adapter)
export function createArticleRouter(articleUseCase: ArticleUseCase) {
  const router = new Hono()

  // GET /articles - Get all articles
  router.get('/', async (c) => {
    try {
      const articles = await articleUseCase.getAllArticles()
      return c.json(articles)
    } catch (error) {
      return c.json({ error: 'Failed to fetch articles' }, 500)
    }
  })

  // GET /articles/:id - Get article by ID
  router.get('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const article = await articleUseCase.getArticleById(id)
      
      if (!article) {
        return c.json({ error: 'Article not found' }, 404)
      }
      
      return c.json(article)
    } catch (error) {
      return c.json({ error: 'Failed to fetch article' }, 500)
    }
  })

  // POST /articles - Create new article
  router.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const article = await articleUseCase.createArticle(body)
      return c.json(article, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create article'
      return c.json({ error: message }, 400)
    }
  })

  // PUT /articles/:id - Update article
  router.put('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const article = await articleUseCase.updateArticle(id, body)
      
      if (!article) {
        return c.json({ error: 'Article not found' }, 404)
      }
      
      return c.json(article)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update article'
      return c.json({ error: message }, 400)
    }
  })

  // DELETE /articles/:id - Delete article
  router.delete('/:id', async (c) => {
    try {
      const id = c.req.param('id')
      const deleted = await articleUseCase.deleteArticle(id)
      
      if (!deleted) {
        return c.json({ error: 'Article not found' }, 404)
      }
      
      return c.json({ message: 'Article deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete article' }, 500)
    }
  })

  return router
}
