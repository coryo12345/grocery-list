import { getDb } from "~/db";
import { groceryList } from "~/db/schema";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  try {
    const db = await getDb();
    const groceries = await db.select().from(groceryList);
    return groceries;
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});