import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  const query = getQuery(event);

  try {
    const db = await getDb();
    if (query.deleteAll === "true") {
      await db
        .delete(groceryList)
        .where(eq(groceryList.householdId, session.householdId));
    } else {
      await db
        .delete(groceryList)
        .where(
          and(
            eq(groceryList.checked, true),
            eq(groceryList.householdId, session.householdId),
          ),
        );
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return [];
});
