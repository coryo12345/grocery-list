import { getDb } from "~/db";
import { categories as categoriesTable } from "~/db/schema";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  try {
    const db = await getDb();
    const categories = await db.select().from(categoriesTable);
    return categories;
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
