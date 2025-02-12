import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries, groceryList } from "~/db/schema";
import { requireAuth } from "~/server/utils/auth";

// GET ALL GROCERIES
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  try {
    const db = await getDb();
    const groceries = await db
      .select()
      .from(groceryList)
      .innerJoin(allGroceries, eq(allGroceries.id, groceryList.itemId))
      .where(
        and(
          eq(groceryList.householdId, session.householdId),
          eq(allGroceries.householdId, session.householdId),
        ),
      );
    return groceries;
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
