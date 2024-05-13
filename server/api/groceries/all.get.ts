import { getDb } from "~/db";
import { allGroceries } from "~/db/schema";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  try {
    const db = await getDb();
    const allItems = await db.select().from(allGroceries);
    return allItems.map((item) => ({
      ...item,
      categories: JSON.parse(item.categories as string),
    }));
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});