import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { allGroceries } from "~/db/schema";

// UPDATES A GROCERY ITEM (doesnt add to list)
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

  console.log(body.id, propertiesToChange);
  try {
    const db = await getDb();
    await db
      .update(allGroceries)
      .set(propertiesToChange)
      .where(eq(allGroceries.id, body.id));
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
  return {};
});
