import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const libsql = createClient({
  url: "file:sqlite.db",
});

const db = drizzle(libsql, { logger: true });

export async function getDb() {
  return db;
}
