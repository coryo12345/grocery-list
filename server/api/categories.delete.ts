import { eq, sql } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, categories } from "~/db/schema";

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
      const updateQuery = sql`update ${allGroceries}`;
      updateQuery.append(
        sql.raw(
          ` set ${allGroceries.categories.name} = (select json_group_array(value) from json_each(${allGroceries.categories.name})`,
        ),
      );
      updateQuery.append(sql` where json_each.value <> ${body.id});`);
      await tx.run(updateQuery);
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
