import { getDb } from "~/db";
import { allGroceries } from "~/db/schema";

// CREATES A GROCERY ITEM (doesnt add to list)
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  const body = await readBody(event);

  try {
    const db = await getDb();
    const newItem = await db
      .insert(allGroceries)
      .values({
        name: body.name,
        householdId: session.householdId,
        description: body.description,
        categories: body.categories,
      })
      .returning();
    return newItem[0];
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
