import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const groceryList = sqliteTable("grocery_list", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  checked: integer("checked", { mode: "boolean" }).default(false),
  order: integer("order"),
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
