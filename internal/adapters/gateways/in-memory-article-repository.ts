import type { 
  Article, 
  ArticleRepository, 
  CreateArticleInput, 
  UpdateArticleInput 
} from '../../domain/article.js'

// Infrastructure Layer - Repository Implementation (Adapter)
export class InMemoryArticleRepository implements ArticleRepository {
  private articles: Map<string, Article> = new Map()
  private currentId = 1

  async findById(id: string): Promise<Article | null> {
    const article = this.articles.get(id)
    return article || null
  }

  async findAll(): Promise<Article[]> {
    return Array.from(this.articles.values())
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const id = `article-${this.currentId++}`
    const now = new Date()
    
    const article: Article = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    }

    this.articles.set(id, article)
    return article
  }

  async update(id: string, input: UpdateArticleInput): Promise<Article | null> {
    const existingArticle = this.articles.get(id)
    
    if (!existingArticle) {
      return null
    }

    const updatedArticle: Article = {
      ...existingArticle,
      ...input,
      updatedAt: new Date(),
    }

    this.articles.set(id, updatedArticle)
    return updatedArticle
  }

  async delete(id: string): Promise<boolean> {
    return this.articles.delete(id)
  }
}
