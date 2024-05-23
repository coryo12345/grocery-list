import { eq, sql } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, categories, presets } from "~/db/schema";

// DELETE a category
export default defineEventHandler(async (event) => {
  requireAuth(event);

  const body = await readBody(event);

  if (typeof body.id !== "number") {
    throw createError({
      statusCode: 400,
      message: "id is required",
    });
  }

  const db = await getDb();

  try {
    await db.transaction(async (tx) => {
      await tx.delete(categories).where(eq(categories.id, body.id));

      // now update all_groceries to remove category from items
      const updateGroceriesQuery = sql`update ${allGroceries}`;
      updateGroceriesQuery.append(
        sql.raw(
          ` set ${allGroceries.categories.name} = (select json_group_array(value) from json_each(${allGroceries.categories.name})`,
        ),
      );
      updateGroceriesQuery.append(sql` where json_each.value <> ${body.id});`);
      await tx.run(updateGroceriesQuery);

      // update presets to remove category from stores
      const updatePresetsQuery = sql`update ${presets}`;
      updatePresetsQuery.append(
        sql.raw(
          ` set ${presets.categories.name} = (select json_group_array(value) from json_each(${presets.categories.name})`,
        ),
      );
      updatePresetsQuery.append(sql` where json_each.value <> ${body.id});`);
      await tx.run(updatePresetsQuery);
    });
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return {};
});
