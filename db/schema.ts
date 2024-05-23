import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const groceryList = sqliteTable("grocery_list", {
  id: integer("id").primaryKey(),
  itemId: integer("item_id").references(() => allGroceries.id),
  checked: integer("checked", { mode: "boolean" }).default(false),
  count: integer("item_count"),
  note: text("note"),
});

export const allGroceries = sqliteTable("all_groceries", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  categories: text("categories", { mode: "json" }).$type<number[]>(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const presets = sqliteTable("presets", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  categories: text("categories", { mode: "json" }).notNull().$type<number[]>(),
});
