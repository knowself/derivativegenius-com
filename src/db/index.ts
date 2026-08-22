import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Lazy-initialized serverless Neon/Postgres client.
 * Returns the typed Drizzle ORM client, or throws if DATABASE_URL is missing.
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export const db = getDb();
export { schema };
