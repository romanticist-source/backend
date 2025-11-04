import type { 
  Article, 
  ArticleRepository, 
  CreateArticleInput, 
  UpdateArticleInput 
} from '../../domain/article.js'

// Application Layer - Use Cases
export class ArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getArticleById(id: string): Promise<Article | null> {
    return await this.articleRepository.findById(id)
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.findAll()
  }

  async createArticle(input: CreateArticleInput): Promise<Article> {
    // Business logic validation can be added here
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }
    
    if (!input.content || input.content.trim() === '') {
      throw new Error('Content is required')
    }

    return await this.articleRepository.create(input)
  }

  async updateArticle(id: string, input: UpdateArticleInput): Promise<Article | null> {
    // Business logic validation can be added here
    const existingArticle = await this.articleRepository.findById(id)
    
    if (!existingArticle) {
      return null
    }

    return await this.articleRepository.update(id, input)
  }

  async deleteArticle(id: string): Promise<boolean> {
    const existingArticle = await this.articleRepository.findById(id)
    
    if (!existingArticle) {
      return false
    }

    return await this.articleRepository.delete(id)
  }
}
