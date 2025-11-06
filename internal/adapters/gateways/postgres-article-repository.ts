import postgres from 'postgres'
import type { 
  Article, 
  ArticleRepository, 
  CreateArticleInput, 
  UpdateArticleInput 
} from '../../domain/article.js'

// Infrastructure Layer - PostgreSQL Repository Implementation
export class PostgresArticleRepository implements ArticleRepository {
  private readonly sql: postgres.Sql

  constructor(connectionString: string) {
    this.sql = postgres(connectionString)
  }

  async findById(id: string): Promise<Article | null> {
    const [article] = await this.sql<Article[]>`
      SELECT id, title, content, author_id as "authorId", created_at as "createdAt", updated_at as "updatedAt"
      FROM articles
      WHERE id = ${id}
    `
    return article || null
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.sql<Article[]>`
      SELECT id, title, content, author_id as "authorId", created_at as "createdAt", updated_at as "updatedAt"
      FROM articles
      ORDER BY created_at DESC
    `
    return articles
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const [article] = await this.sql<Article[]>`
      INSERT INTO articles (title, content, author_id, created_at, updated_at)
      VALUES (${input.title}, ${input.content}, ${input.authorId}, NOW(), NOW())
      RETURNING id, title, content, author_id as "authorId", created_at as "createdAt", updated_at as "updatedAt"
    `
    return article
  }

  async update(id: string, input: UpdateArticleInput): Promise<Article | null> {
    if (Object.keys(input).length === 0) {
      return this.findById(id)
    }

    // Build dynamic SET clause
    const updates: Record<string, any> = { updated_at: this.sql`NOW()` }
    if (input.title !== undefined) updates.title = input.title
    if (input.content !== undefined) updates.content = input.content
    if (input.authorId !== undefined) updates.author_id = input.authorId

    const [article] = await this.sql<Article[]>`
      UPDATE articles
      SET ${this.sql(updates)}
      WHERE id = ${id}
      RETURNING id, title, content, author_id as "authorId", created_at as "createdAt", updated_at as "updatedAt"
    `
    
    return article || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM articles
      WHERE id = ${id}
    `
    return result.count > 0
  }

  // Utility method to close the connection
  async close(): Promise<void> {
    await this.sql.end()
  }
}
