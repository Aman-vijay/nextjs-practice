import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/neon-http/migrator";

loadEnvConfig(process.cwd());

const { db } = await import("../db");

await migrate(db, { migrationsFolder: "drizzle" });

console.log("Drizzle migrations applied successfully");
