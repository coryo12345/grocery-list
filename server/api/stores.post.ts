import { getDb } from "~/db";
import { presets } from "~/db/schema";

// add a store
export default defineEventHandler(async (event) => {
  requireAuth(event);

  const body = await readBody(event);

  try {
    const db = await getDb();
    // TODO set initial category list to current category set (alphabetically)
    // should wrap it in a transaction
    const stores = await db
      .insert(presets)
      .values({ name: body.name, categories: [] })
      .returning();
    return stores[0];
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
