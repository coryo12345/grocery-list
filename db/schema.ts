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
});

export const allGroceries = sqliteTable("all_groceries", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const presets = sqliteTable(
  "presets",
  {
    presetId: integer("preset_id"),
    categoryId: integer("category_id").references(() => categories.id),
    order: integer("order"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.presetId, table.categoryId] }),
    };
  },
);
