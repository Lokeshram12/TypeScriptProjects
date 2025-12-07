import { defineConfig } from "drizzle-kit";

import { config2 } from "./src/config";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config2.dbURL,
  },
});
