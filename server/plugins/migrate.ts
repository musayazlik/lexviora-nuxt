import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../utils/db';

/**
 * Applies Drizzle migrations on server start.
 * Only active when MIGRATIONS_DIR is set (the Docker image sets it),
 * so local development keeps using `npm run db:migrate`.
 * Disable entirely with RUN_MIGRATIONS=false.
 */
export default defineNitroPlugin(async () => {
  if (process.env.RUN_MIGRATIONS === 'false') return;

  const migrationsFolder = process.env.MIGRATIONS_DIR;
  if (!migrationsFolder) return;

  try {
    await migrate(db, { migrationsFolder });
    console.log(`[db] migrations applied from ${migrationsFolder}`);
  } catch (error) {
    console.error('[db] migration failed:', error);
  }
});
