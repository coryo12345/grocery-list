import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  const db = await getDb();

  try {
    await db.delete(groceryList);
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return [];
});
