import postgres from 'postgres'

// Database initialization script
export async function initDatabase(connectionString: string): Promise<void> {
  const sql = postgres(connectionString)

  try {
    // Install uuid-ossp extension for UUID generation
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Create user table
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

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_mail ON "user"(mail) WHERE is_deleted = false`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_is_deleted ON "user"(is_deleted)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_created_at ON "user"(created_at DESC)`

    // Create helper table
    await sql`
      CREATE TABLE IF NOT EXISTS helper (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        name VARCHAR NOT NULL,
        nickname VARCHAR NOT NULL,
        phone_number VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        relationship VARCHAR NOT NULL
      )
    `
    
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_helper_email ON helper(email)`

    // Create emergency_contact table
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_contact (
        user_id VARCHAR NOT NULL,
        helper_id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        relationship VARCHAR NOT NULL,
        phone_number VARCHAR NOT NULL,
        is_main BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (user_id, helper_id)
      )
    `

    // Create user_status_card table
    await sql`
      CREATE TABLE IF NOT EXISTS user_status_card (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id VARCHAR NOT NULL,
        blood_type VARCHAR,
        allergy VARCHAR,
        medicine VARCHAR
      )
    `

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_status_card_user_id ON user_status_card(user_id)`

    // Create user_status_card_disease table
    await sql`
      CREATE TABLE IF NOT EXISTS user_status_card_disease (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_status_card_id VARCHAR NOT NULL,
        name VARCHAR NOT NULL
      )
    `

    // Create user_help_card table
    await sql`
      CREATE TABLE IF NOT EXISTS user_help_card (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id VARCHAR NOT NULL
      )
    `

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_help_card_user_id ON user_help_card(user_id)`

    // Create user_schedule table
    await sql`
      CREATE TABLE IF NOT EXISTS user_schedule (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id VARCHAR NOT NULL,
        title VARCHAR,
        description TEXT,
        schedule_type VARCHAR NOT NULL,
        is_repeat BOOLEAN NOT NULL,
        start_at TIMESTAMP NOT NULL
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_user_schedule_user_id ON user_schedule(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_schedule_start_at ON user_schedule(start_at DESC)`

    // Create user_repeat_schedule table
    await sql`
      CREATE TABLE IF NOT EXISTS user_repeat_schedule (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        schedule_type VARCHAR NOT NULL,
        interval INT NOT NULL,
        schedule_time TIME NOT NULL
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_user_repeat_schedule_user_id ON user_repeat_schedule(user_id)`

    // Create alert_history table
    await sql`
      CREATE TABLE IF NOT EXISTS alert_history (
        id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        importance SMALLINT NOT NULL,
        alert_type VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_alert_history_user_id ON alert_history(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_alert_history_created_at ON alert_history(created_at DESC)`

    // Create user_alert_history table
    await sql`
      CREATE TABLE IF NOT EXISTS user_alert_history (
        user_id VARCHAR NOT NULL,
        alert_id VARCHAR NOT NULL,
        is_checked BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (user_id, alert_id)
      )
    `

    // Create helper_alert_history table
    await sql`
      CREATE TABLE IF NOT EXISTS helper_alert_history (
        helper_id VARCHAR NOT NULL,
        alert_id VARCHAR NOT NULL,
        is_checked BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (helper_id, alert_id)
      )
    `

    // Add foreign keys
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_emergency_contact_user') THEN
          ALTER TABLE emergency_contact ADD CONSTRAINT fk_emergency_contact_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_emergency_contact_helper') THEN
          ALTER TABLE emergency_contact ADD CONSTRAINT fk_emergency_contact_helper FOREIGN KEY (helper_id) REFERENCES helper (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_status_card_user') THEN
          ALTER TABLE user_status_card ADD CONSTRAINT fk_user_status_card_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_status_card_disease_card') THEN
          ALTER TABLE user_status_card_disease ADD CONSTRAINT fk_user_status_card_disease_card FOREIGN KEY (user_status_card_id) REFERENCES user_status_card (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_help_card_user') THEN
          ALTER TABLE user_help_card ADD CONSTRAINT fk_user_help_card_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_schedule_user') THEN
          ALTER TABLE user_schedule ADD CONSTRAINT fk_user_schedule_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_repeat_schedule_user') THEN
          ALTER TABLE user_repeat_schedule ADD CONSTRAINT fk_user_repeat_schedule_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_alert_history_user') THEN
          ALTER TABLE alert_history ADD CONSTRAINT fk_alert_history_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_alert_history_user') THEN
          ALTER TABLE user_alert_history ADD CONSTRAINT fk_user_alert_history_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_alert_history_alert') THEN
          ALTER TABLE user_alert_history ADD CONSTRAINT fk_user_alert_history_alert FOREIGN KEY (alert_id) REFERENCES alert_history (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_helper_alert_history_helper') THEN
          ALTER TABLE helper_alert_history ADD CONSTRAINT fk_helper_alert_history_helper FOREIGN KEY (helper_id) REFERENCES helper (id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_helper_alert_history_alert') THEN
          ALTER TABLE helper_alert_history ADD CONSTRAINT fk_helper_alert_history_alert FOREIGN KEY (alert_id) REFERENCES alert_history (id) ON DELETE CASCADE;
        END IF;
      END $$;
    `

    console.log('✅ Database tables initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  } finally {
    await sql.end()
  }
}
