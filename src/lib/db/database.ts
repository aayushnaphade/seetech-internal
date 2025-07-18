import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createClient } from '@libsql/client';
import { drizzle as drizzleTurso } from 'drizzle-orm/libsql';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Database client type
type DatabaseClient = ReturnType<typeof drizzle<typeof schema>> | ReturnType<typeof drizzleTurso<typeof schema>>;

let db: DatabaseClient;

if (NODE_ENV === 'production' && DATABASE_URL) {
  // Production: Use Turso (cloud SQLite)
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });
  db = drizzleTurso(client, { schema });
} else {
  // Development: Use local SQLite
  const sqlite = new Database('./data/local.db');
  db = drizzle(sqlite, { schema });
}

export { db };
export * from './schema';
