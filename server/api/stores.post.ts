import { getDb } from "~/db";
import { categories, presets } from "~/db/schema";

// add a store
export default defineEventHandler(async (event) => {
  requireAuth(event);

  const body = await readBody(event);

  try {
    const db = await getDb();

    const newStore = await db.transaction(async (tx) => {
      const categoryIdsRaw = await tx
        .select({ id: categories.id })
        .from(categories)
        .orderBy(categories.name);
      const categoryIds = categoryIdsRaw.map((x) => x.id);
      const stores = await tx
        .insert(presets)
        .values({ name: body.name, categories: categoryIds })
        .returning();
      return stores[0];
    });

    return newStore;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
