import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, groceryList } from "~/db/schema";

// ADD GROCERY (upsert)
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);
  const body = await readBody(event);
  const id = body.id;

  if (!body.name || body.name.length < 1) {
    throw createError({
      statusCode: 400,
      message: "Name is required and may not be empty",
    });
  }

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
        .where(
          and(
            eq(allGroceries.id, id),
            eq(allGroceries.householdId, session.householdId),
          ),
        );
    } else {
      const item = await db
        .insert(allGroceries)
        .values({
          name: body.name,
          householdId: session.householdId,
          description: body.description,
          categories: body.categories,
        })
        .returning();
      itemId = item[0].id;
    }

    const item = await db
      .insert(groceryList)
      .values({
        itemId: itemId,
        checked: false,
        householdId: session.householdId,
        count: body.count,
        note: body.note,
      })
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
