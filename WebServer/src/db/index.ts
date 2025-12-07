import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";
import { fileURLToPath } from "url";

import * as schema from "../schema.js";
import { config2 } from "../config.js";

const conn = postgres(config2.dbURL);
const migrationClient = postgres(config2.dbURL, { max: 1 });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationPath = path.join(__dirname, "../../src/db/migrations");

console.log("Migration path:", migrationPath);

try {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: migrationPath,
  });
} catch (error) {
  console.warn("Migration folder not found or migrations failed:", error);
}

migrationClient.end();
export const db = drizzle(conn, { schema });