import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://lexviora:lexviora@localhost:5432/lexviora',
  },
});
