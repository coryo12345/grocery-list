import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries } from "~/db/schema";

// GETS ALL GROCERY_ITEMS (ignoring current list)
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  try {
    const db = await getDb();
    const allItems = await db
      .select()
      .from(allGroceries)
      .where(eq(allGroceries.householdId, session.householdId))
      .orderBy(allGroceries.name);
    return allItems.map((item) => ({
      ...item,
      categories: item.categories as number[],
    }));
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
