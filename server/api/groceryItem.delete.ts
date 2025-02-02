import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, groceryList } from "~/db/schema";

// DELETE A GROCERY ITEM (doesnt add to list)
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  const body = await readBody(event);

  if (typeof body.id !== "number") {
    throw createError({
      statusCode: 400,
      message: "id is required",
    });
  }

  try {
    const db = await getDb();
    await db.transaction(async (tx) => {
      await tx
        .delete(groceryList)
        .where(
          and(
            eq(groceryList.itemId, body.id),
            eq(groceryList.householdId, session.householdId),
          ),
        );
      await tx
        .delete(allGroceries)
        .where(
          and(
            eq(allGroceries.householdId, session.householdId),
            eq(allGroceries.id, body.id),
          ),
        );
    });
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
