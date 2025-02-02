import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categories as categoriesTable } from "~/db/schema";

// GET CATEGORIES
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  try {
    const db = await getDb();
    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.householdId, session.householdId))
      .orderBy(categoriesTable.name);
    return categories;
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
