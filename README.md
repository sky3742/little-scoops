# LittleScoops

A baby care tracking app for monitoring milk powder usage and diaper consumption. Built with Next.js, shadcn/ui, and PostgreSQL.

## Features

- **Milk Powder Tracking** - Log purchases (kg), record feedings (scoops), calculate rolling 7-day average daily usage, project days of stock remaining
- **Diaper Tracking** - Log purchases (count), quick-log diaper changes with type (wet/dirty/both), calculate rolling 7-day average usage, project days remaining
- **Dashboard** - Single-page overview with stock status, quick actions, today's feeding breakdown by time of day, and recent activity
- **Delete Entries** - Swipe-to-delete on recent activity with confirmation dialog
- **CSV Export** - Download milk or diaper data as CSV for pediatrician visits
- **Toast Notifications** - Success/error feedback on all actions
- **Error Handling** - Graceful error states for failed fetches and mutations

## Tech Stack

| Layer     | Technology                               |
| --------- | ---------------------------------------- |
| Framework | Next.js 16 (App Router)                  |
| UI        | shadcn/ui, Tailwind CSS v4, Lucide icons |
| Database  | PostgreSQL on Neon                       |
| ORM       | Drizzle ORM                              |
| Testing   | Vitest, Testing Library                  |
| Fonts     | Geist                                    |

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your Neon connection string

# Push database schema
pnpm db:push

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Production build         |
| `pnpm start`         | Start production server  |
| `pnpm lint`          | Run ESLint               |
| `pnpm format`        | Format with Prettier     |
| `pnpm test`          | Run tests                |
| `pnpm test:watch`    | Run tests in watch mode  |
| `pnpm test:coverage` | Run tests with coverage  |
| `pnpm db:push`       | Push schema to database  |
| `pnpm db:generate`   | Generate migration files |
| `pnpm db:migrate`    | Run database migrations  |
| `pnpm db:studio`     | Open Drizzle Studio      |

## Database

6 tables managed by Drizzle ORM:

- `milk_purchases` - Milk powder purchases (amount in kg)
- `milk_feedings` - Feeding records (scoops, grams per scoop)
- `diaper_purchases` - Diaper purchases (count)
- `diaper_changes` - Diaper change records (count, type: wet/dirty/both, date)
- `handoffs` - Babysitter handoff events (item type, amount)
- `babysitter_days` - Days daughter is at babysitter

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard (client component)
│   ├── layout.tsx            # Root layout with metadata
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Loading state
│   ├── not-found.tsx         # 404 page
│   ├── icon.tsx              # Favicon (32x32)
│   ├── apple-icon.tsx        # Apple touch icon (180x180)
│   ├── opengraph-image.tsx   # OG image
│   └── api/
│       ├── milk/               # Milk purchase/feeding CRUD, stock, history
│       ├── diaper/             # Diaper purchase/change CRUD, stock, history
│       ├── babysitter/         # Handoff events, babysitter day tracking
│       ├── undo/               # Undo soft-deleted records
│       ├── cleanup/            # Purge old soft-deleted records
│       └── export/             # CSV export (diaper)
├── components/
│   ├── ui/                   # shadcn components
│   ├── swipe-to-delete.tsx   # Swipe gesture component
│   └── toast.tsx             # Toast notification system
├── db/
│   ├── index.ts              # Drizzle/Neon connection
│   └── schema.ts             # Database schema
├── lib/
│   ├── utils.ts              # cn() utility
│   └── constants.ts          # App-wide constants
└── __tests__/                # Test setup
drizzle/                      # Generated migration files
.github/workflows/ci.yml     # CI: lint, test, migration drift check
```

## Code Quality

- **Pre-commit hooks** via Husky + lint-staged (ESLint + Prettier on every commit)
- **Auto migration generation** — pre-commit hook detects schema changes and runs `db:generate` automatically
- **Migration drift check** — CI fails if generated migrations are out of sync with schema
- **Commit messages** enforced via commitlint (conventional commits)
- **177 unit tests** across components, API routes, and dashboard

## Roadmap

- [x] Undo delete (toast with undo action)
- [x] Diaper change details (wet / dirty / both)
- [x] Time-of-day breakdown for feedings
- [x] Data export (CSV) for pediatrician visits
- [x] Babysitter tracking (handoffs, separate stock pools)
- [ ] Low-stock push notifications
- [ ] Multi-child support
- [ ] Sleep tracking
- [ ] Temperature / fever logging
- [ ] Growth tracking (weight, height)
- [ ] Medicine / vitamin schedule
- [ ] Photo attachments on entries
- [ ] Analytics charts (weekly / monthly trends)
- [ ] PWA offline support (service worker)
