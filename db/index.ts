import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

let db: ReturnType<typeof drizzle>;

async function createConnection() {
  const dev = ["local", "dev", "development"].includes(
    process.env.NUXT_ENVIRONMENT ?? "",
  );

  const libsql = createClient({
    url: "file:sqlite.db",
  });

  db = drizzle(libsql, { logger: dev });

  if (dev) {
    await db.run(sql`PRAGMA journal_mode=WAL;`);
  }
}

export async function getDb() {
  if (!db) {
    await createConnection();
  }
  if (!db) {
    throw new Error("Error initiating DB connection");
  }
  return db;
}
