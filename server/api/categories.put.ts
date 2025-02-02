import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categories } from "~/db/schema";

// CREATE CATEGORY
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);
  const body = (await readBody(event)) as Omit<
    typeof categories.$inferInsert,
    "id"
  >;

  const db = await getDb();

  let row = [];
  try {
    row = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.householdId, session.householdId),
          eq(categories.name, body.name),
        ),
      );
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
  if (row.length > 0) {
    throw createError({
      statusCode: 400,
      message: "name already in use",
    });
  }

  let newRow: (typeof categories.$inferSelect)[];
  try {
    newRow = await db
      .insert(categories)
      .values({
        name: body.name,
        householdId: session.householdId,
      })
      .returning();
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }

  if (newRow.length < 1) {
    throw createError({
      statusCode: 500,
      message: "unable to insert new row",
    });
  }

  return newRow[0];
});
