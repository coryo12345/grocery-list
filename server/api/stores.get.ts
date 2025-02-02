import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categories, presets } from "~/db/schema";

// GETS ALL stores
export default defineEventHandler(async (event) => {
  const session = requireAuth(event);

  try {
    const db = await getDb();
    const categoryIds = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.householdId, session.householdId));
    const storesRaw = await db
      .select()
      .from(presets)
      .where(eq(presets.householdId, session.householdId));
    let stores = storesRaw.map((store) => {
      // remove deleted categories
      store.categories = store.categories.filter((id) =>
        categoryIds.find((c) => c.id === id),
      );
      // add in missing categories to end
      categoryIds.forEach((c) => {
        if (!store.categories.includes(c.id)) {
          store.categories.push(c.id);
        }
      });
      return store;
    });
    return stores;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
