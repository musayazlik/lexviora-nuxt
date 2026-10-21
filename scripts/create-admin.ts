import 'dotenv/config';

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password || !name) {
    console.error('Usage: npm run admin:create -- <email> <password> "Full Name"');
    process.exit(1);
  }

  // Dynamic import so dotenv/config runs first.
  const { auth } = await import('../server/utils/auth');

  const { user } = await auth.api.createUser({
    body: { email, password, name, role: 'admin' },
  });

  console.log(`[admin] created: ${user.email} (role: admin)`);
  process.exit(0);
}

main().catch((error) => {
  console.error('[admin] failed:', error);
  process.exit(1);
});
