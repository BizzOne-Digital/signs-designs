import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "YourStrongPassword"  (minimum 10 characters)');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
// Next.js expands "$NAME" sequences in .env files, so every "$" must be escaped there.
const escaped = hash.split("$").join("\\$");

console.log("\nFor .env.local (dollar signs escaped):");
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
console.log("\nFor the Vercel dashboard (raw value, no backslashes):");
console.log(hash);
console.log("");
