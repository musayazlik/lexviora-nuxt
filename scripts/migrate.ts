import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../server/utils/db';

await migrate(db, { migrationsFolder: './server/database/migrations' });
console.log('[db] migrations applied.');
process.exit(0);
