import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing DATABASE_URL. Add it to team-mangement/.env.local before using the database.",
  );
}

const client = neon(databaseUrl);

export const db = drizzle(client, {
  schema,
});

export { schema };
