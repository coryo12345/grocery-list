import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const groceryList = sqliteTable("grocery_list", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  checked: integer("checked", { mode: "boolean" }).default(false),
  order: integer("order"),
});
