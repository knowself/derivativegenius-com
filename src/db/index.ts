import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy-initialized serverless Neon/Postgres client
function createDbClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return null in unconfigured/build environments to prevent build-time crashes
    return null;
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export const db = createDbClient();
export { schema };
