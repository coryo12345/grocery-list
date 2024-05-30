import { createClient, type Config } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

let db: ReturnType<typeof drizzle>;

async function createConnection() {
  const local = ["local", "localhost"].includes(
    process.env.NUXT_ENVIRONMENT ?? "",
  );
  const dev = ["dev", "development"].includes(
    process.env.NUXT_ENVIRONMENT ?? "",
  );

  let connectionConfig: Config = {
    url: "file:sqlite.db",
  };
  if (!local) {
    connectionConfig = {
      url: process.env.APP_DB_URL ?? "",
      authToken: process.env.APP_DB_TOKEN ?? "",
    };
  }

  const libsql = createClient(connectionConfig);

  db = drizzle(libsql, { logger: dev || local });

  if (local) {
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
