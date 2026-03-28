# Drizzle + Neon + Bun Guide

This project uses:

- `Next.js` for the app
- `Bun` for running scripts
- `drizzle-orm` for schema/querying
- `drizzle-kit` for generating migrations
- `@neondatabase/serverless` for Neon

## Current Folder Structure

```text
team-mangement/
  app/
    api/
      health/
        db/
          route.ts
  db/
    index.ts
    schema.ts
  drizzle/
    0000_fearless_earthquake.sql
    meta/
  scripts/
    migrate.ts
    test-db.ts
  drizzle.config.ts
  .env.local
```

## What Each File Does

- `db/schema.ts`
  Defines tables, enums, relations, and types.
- `db/index.ts`
  Creates the Drizzle database client.
- `drizzle.config.ts`
  Tells `drizzle-kit` where the schema is and where to write migrations.
- `scripts/migrate.ts`
  Applies generated migrations to Neon using Bun.
- `scripts/test-db.ts`
  Checks if Neon is reachable and whether the expected tables exist.
- `app/api/health/db/route.ts`
  Simple API route to test DB access from Next.js.

## Environment Setup

Put your connection string in:

```env
team-mangement/.env.local
```

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Important:

- Use the `.env.local` inside `team-mangement/`
- The root-level `.env.local` is not the one this app uses

## Install And Run

From inside `team-mangement`:

```bash
bun install
bun run dev
```

## Day-To-Day Workflow

Whenever you change the database schema:

1. Edit `db/schema.ts`
2. Generate a migration
3. Apply the migration
4. Test the connection and tables

Commands:

```bash
bun run db:generate
bun run db:migrate
bun run db:test
```

## First-Time Setup Again

If you ever want to repeat this setup in a fresh project:

1. Install packages

```bash
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit
```

2. Create:

- `db/schema.ts`
- `db/index.ts`
- `drizzle.config.ts`
- `scripts/migrate.ts`
- `scripts/test-db.ts`
- `.env.local`

3. Add scripts to `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "bun run scripts/migrate.ts",
    "db:test": "bun run scripts/test-db.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

4. Then run:

```bash
bun run db:generate
bun run db:migrate
bun run db:test
```

## How To Add A New Table

Example:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

After adding it:

```bash
bun run db:generate
bun run db:migrate
bun run db:test
```

## How To Create Indexes

For indexes in Drizzle, import `index` or `uniqueIndex` from `drizzle-orm/pg-core`.

Example:

```ts
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    teamId: uuid("team_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("users_email_unique_idx").on(table.email),
    teamIndex: index("users_team_id_idx").on(table.teamId),
    nameIndex: index("users_name_idx").on(table.name),
  }),
);
```

Notes:

- Use `index(...)` for normal indexes
- Use `uniqueIndex(...)` when values must be unique
- You can keep using `.unique()` on a column for simple uniqueness
- Use named indexes so migrations stay readable

## How To Add Composite Indexes

Example:

```ts
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    teamId: uuid("team_id").notNull(),
    status: text("status").notNull(),
  },
  (table) => ({
    userTeamIndex: index("memberships_user_team_idx").on(table.userId, table.teamId),
  }),
);
```

That is useful when you query by more than one column together.

## How To Add Relations

Example:

```ts
import { relations } from "drizzle-orm";

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
}));
```

## How To Query In Routes

Example:

```ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const allUsers = await db.select().from(users);

  return NextResponse.json(allUsers);
}
```

## How To Check The Database

Use:

```bash
bun run db:test
```

Or open:

```text
/api/health/db
```

## How To Inspect Data Visually

Use:

```bash
bun run db:studio
```

## Recommended Change Loop

If you add a table, index, enum, or foreign key:

```bash
bun run db:generate
bun run db:migrate
bun run db:test
```

If `db:test` passes, your schema is usually in good shape.

## Important Gotcha

Avoid depending on `bun run db:push` in this project for normal work.

Reason:

- `drizzle-kit push` may ask for interactive confirmation
- non-interactive shells can fail on that step
- `db:migrate` is the safer repeatable workflow here

## Current Schema Summary

Right now the project has:

- `role` enum
- `teams` table
- `users` table
- relation from `users.teamId` to `teams.id`

## Quick Cheatsheet

```bash
# after schema changes
bun run db:generate
bun run db:migrate
bun run db:test

# inspect data
bun run db:studio
```
