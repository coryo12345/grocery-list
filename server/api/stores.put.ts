import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categories, presets } from "~/db/schema";

// add a store
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  const body = await readBody(event);

  let rows;
  try {
    const db = await getDb();

    rows = await db
      .update(presets)
      .set({ name: body.name, categories: body.categories })
      .where(
        and(
          eq(presets.id, body.id),
          eq(presets.householdId, session.householdId),
        ),
      )
      .returning();
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  if (rows.length < 1) {
    throw createError({
      statusCode: 400,
      message: "Unable to update this store",
    });
  }
  return rows[0];
});
