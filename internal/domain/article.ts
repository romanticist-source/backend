// Domain Entity
export interface Article {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export type CreateArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateArticleInput = Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>

// Domain Repository Interface (Port)
export interface ArticleRepository {
  findById(id: string): Promise<Article | null>
  findAll(): Promise<Article[]>
  create(input: CreateArticleInput): Promise<Article>
  update(id: string, input: UpdateArticleInput): Promise<Article | null>
  delete(id: string): Promise<boolean>
}
