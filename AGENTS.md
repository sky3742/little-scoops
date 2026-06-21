<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Database schema changes

NEVER manually write SQL migration files in `drizzle/`. When you change `src/db/schema.ts`:

1. Edit `src/db/schema.ts` only
2. Run `pnpm db:generate` — drizzle-kit generates the SQL migration automatically
3. Run `pnpm db:push` (local) or `pnpm db:migrate` (CI) to apply

Do NOT create `.sql` files by hand. Do NOT edit files in `drizzle/meta/`. Let drizzle-kit own the migration lifecycle.

Note: `db:migrate` only works in CI or environments with WebSocket support. Use `db:push` for local development.
