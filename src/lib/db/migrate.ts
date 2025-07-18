import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  console.log('Running database migration...');
  
  try {
    // Initialize the database
    const db = new Database('./data/local.db');
    
    // Read the migration file
    const migrationPath = join(process.cwd(), 'src/lib/db/migrations/0000_fat_ogun.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split by statement separator and execute
    const statements = migrationSQL.split('--> statement-breakpoint').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (cleanStatement && !cleanStatement.startsWith('--')) {
        console.log('Executing:', cleanStatement.substring(0, 50) + '...');
        db.exec(cleanStatement);
      }
    }
    
    console.log('Migration completed successfully!');
    db.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
