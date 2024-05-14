import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categories } from "~/db/schema";

// DELETE a category
export default defineEventHandler(async (event) => {
  requireAuth(event);

  const body = await readBody(event);

  if (typeof body.id !== "number") {
    throw createError({
      statusCode: 400,
      message: "id is required",
    });
  }

  try {
    const db = await getDb();
    await db.delete(categories).where(eq(categories.id, body.id));
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  return {};
});
