import postgres from 'postgres'

// Database initialization script
export async function initDatabase(connectionString: string): Promise<void> {
  const sql = postgres(connectionString)

  try {
    // Install uuid-ossp extension for UUID generation
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Create user table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        name VARCHAR NOT NULL,
        age INT NOT NULL,
        mail VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        address VARCHAR,
        comment VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      )
    `

    // Create unique index on mail
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_mail 
      ON "user"(mail) WHERE is_deleted = false
    `

    // Create index on is_deleted for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_is_deleted 
      ON "user"(is_deleted)
    `

    // Create index on created_at for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_created_at 
      ON "user"(created_at DESC)
    `

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
