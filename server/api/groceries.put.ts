import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

// UPDATE GROCERY_LIST ITEM
export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  if (typeof body.id !== "number") {
    throw createError({
      statusCode: 400,
      message: "id is required",
    });
  }

  const propertiesToChange = { ...body };
  delete propertiesToChange.id;

  try {
    const db = await getDb();
    await db
      .update(groceryList)
      .set(propertiesToChange)
      .where(eq(groceryList.id, body.id));
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return {};
});
