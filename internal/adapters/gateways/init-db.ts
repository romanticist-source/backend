import postgres from 'postgres'

// Database initialization script
export async function initDatabase(connectionString: string): Promise<void> {
  const sql = postgres(connectionString)

  try {
    // Create articles table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create index on created_at for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_created_at 
      ON articles(created_at DESC)
    `

    // Create index on author_id for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_author_id 
      ON articles(author_id)
    `

    console.log('✅ Database tables initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  } finally {
    await sql.end()
  }
}
