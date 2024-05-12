import { getDb } from "~/db";

export default defineEventHandler(async (event) => {
  requireAuth(event);

  try {
    const db = await getDb();
    // check if item exists in master list
    // update if it does
    // create if it doesn't
    // add it to grocery list
    // return item
    return {};
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "something went wrong",
    });
  }
});
