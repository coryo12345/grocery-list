import { getDb } from "~/db";
import { presets } from "~/db/schema";

// GETS ALL stores
export default defineEventHandler(async (event) => {
  requireAuth(event);

  try {
    const db = await getDb();
    const stores = await db.select().from(presets);
    // TODO need to add in missing categories and remove deleted categories by id
    return stores;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
