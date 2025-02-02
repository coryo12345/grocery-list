import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

// DELETE GROCERY_LIST ITEM
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
    await db
      .delete(groceryList)
      .where(
        and(
          eq(groceryList.householdId, session.householdId),
          eq(groceryList.id, body.id),
        ),
      );
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return {};
});
