import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const household = sqliteTable("household", {
  id: integer("id").primaryKey(),
  householdName: text("household_name").notNull(),
  password: text("password").notNull(),
});

export const groceryList = sqliteTable("grocery_list", {
  id: integer("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  itemId: integer("item_id").references(() => allGroceries.id),
  checked: integer("checked", { mode: "boolean" }).default(false),
  count: integer("item_count"),
  note: text("note"),
});

export const allGroceries = sqliteTable(
  "all_groceries",
  {
    id: integer("id").primaryKey(),
    householdId: integer("household_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    categories: text("categories", { mode: "json" }).$type<number[]>(),
  },
  (t) => ({
    unq: unique().on(t.householdId, t.name),
  }),
);

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey(),
    householdId: integer("household_id").notNull(),
    name: text("name").notNull(),
  },
  (t) => ({
    unq: unique().on(t.householdId, t.name),
  }),
);

export const presets = sqliteTable(
  "presets",
  {
    id: integer("id").primaryKey(),
    householdId: integer("household_id").notNull(),
    name: text("name").notNull(),
    categories: text("categories", { mode: "json" })
      .notNull()
      .$type<number[]>(),
  },
  (t) => ({
    unq: unique().on(t.householdId, t.name),
  }),
);
