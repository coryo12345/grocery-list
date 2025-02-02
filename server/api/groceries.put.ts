import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { groceryList } from "~/db/schema";

// UPDATE GROCERY_LIST ITEM
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);
  const body = await readBody(event);

  if (typeof body.id !== "number") {
    throw createError({
      statusCode: 400,
      message: "id is required",
    });
  }

  const propertiesToChange = { ...body };
  delete propertiesToChange.id;
  delete propertiesToChange.householdId;

  try {
    const db = await getDb();
    await db
      .update(groceryList)
      .set(propertiesToChange)
      .where(
        and(
          eq(groceryList.id, body.id),
          eq(groceryList.householdId, session.householdId),
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
