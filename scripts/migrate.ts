import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { categories } from "~/db/schema";
import { sql } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
await migrate(db, { migrationsFolder: "./drizzle" });

// seed any required data
// categories
await db
  .insert(categories)
  .values([
    { id: 0, name: "Produce" },
    { id: 1, name: "Seafood" },
    { id: 2, name: "Bread" },
    { id: 3, name: "Meat" },
    { id: 4, name: "Dairy" },
    { id: 5, name: "Frozen" },
  ])
  .onConflictDoUpdate({
    target: categories.id,
    set: { name: sql.raw(`excluded.${categories.name.name}`) },
  });
