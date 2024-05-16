import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, groceryList } from "~/db/schema";

// ADD GROCERY (upsert)
export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const id = body.id;

  try {
    const db = await getDb();
    let itemId;

    if (id !== undefined && id !== null) {
      itemId = id;
      await db
        .update(allGroceries)
        .set({
          name: body.name,
          description: body.description,
          categories: body.categories,
        })
        .where(eq(allGroceries.id, id));
    } else {
      const item = await db
        .insert(allGroceries)
        .values({
          name: body.name,
          description: body.description,
          categories: body.categories,
        })
        .returning();
      itemId = item[0].id;
    }

    const item = await db
      .insert(groceryList)
      .values({ itemId: itemId, checked: false })
      .returning();

    return item;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
