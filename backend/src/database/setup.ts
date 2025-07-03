import { query, testConnection } from './config'

const createTables = async () => {
  try {
    console.log('🚀 Setting up database tables...')

    // Create todos table
    await query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)



    // Create updated_at trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    // Create triggers for updated_at
    await query(`
      DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
      CREATE TRIGGER update_todos_updated_at
        BEFORE UPDATE ON todos
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `)

    console.log('✅ Database tables created successfully!')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

const setupDatabase = async () => {
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ Cannot connect to database. Please check your configuration.')
    process.exit(1)
  }

  await createTables()
  console.log('🎉 Database setup completed!')
  process.exit(0)
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

export { setupDatabase }
