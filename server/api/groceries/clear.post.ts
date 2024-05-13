import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  const query = getQuery(event);

  try {
    const db = await getDb();
    if (query.deleteAll === "true") {
      await db.delete(groceryList);
    } else {
      await db.delete(groceryList).where(eq(groceryList.checked, true));
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return [];
});
