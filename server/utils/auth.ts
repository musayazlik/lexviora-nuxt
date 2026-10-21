import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import * as schema from '../database';
import { db } from './db';
import { ac, roles } from '#shared/permissions';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.NUXT_PUBLIC_SITE_URL
    ? [process.env.NUXT_PUBLIC_SITE_URL]
    : undefined,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day
  },
  plugins: [
    admin({
      ac,
      roles,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
