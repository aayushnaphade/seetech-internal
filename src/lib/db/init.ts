import { db } from './database';
import { initializeDatabase } from './services';

async function init() {
  console.log('Initializing database...');
  
  try {
    // Initialize with sample data - the database tables will be created automatically
    console.log('Initializing with sample data...');
    await initializeDatabase();
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
}

init();
