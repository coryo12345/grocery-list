import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "~/db";
import { categories } from "~/db/schema";

const db = await getDb();
await migrate(db, { migrationsFolder: "./drizzle" });

// seed any required data
// categories
await db
  .insert(categories)
  .values([
    { id: 0, householdId: 1, name: "Produce" },
    { id: 1, householdId: 1, name: "Seafood" },
    { id: 2, householdId: 1, name: "Bread" },
    { id: 3, householdId: 1, name: "Meat" },
    { id: 4, householdId: 1, name: "Dairy" },
    { id: 5, householdId: 1, name: "Frozen" },
  ])
  .onConflictDoUpdate({
    target: categories.id,
    set: { name: sql.raw(`excluded.${categories.name.name}`) },
  });
