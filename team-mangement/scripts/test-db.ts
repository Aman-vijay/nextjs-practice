import { loadEnvConfig } from "@next/env";
import { sql } from "drizzle-orm";

loadEnvConfig(process.cwd());

const { db } = await import("../db");

const result = await db.execute(sql`
  select
    now() as server_time,
    current_database() as database_name,
    current_user as database_user
`);

const tables = await db.execute(sql`
  select table_name
  from information_schema.tables
  where table_schema = 'public'
    and table_name in ('teams', 'users')
  order by table_name
`);

console.log("Neon connection successful");
console.table(result);
console.log("Detected app tables");
console.table(tables);
if (tables.rows.length !== 2) {
  process.exitCode = 1;
}
