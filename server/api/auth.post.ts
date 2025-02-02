import { eq } from "drizzle-orm";
import CONSTANTS from "~/constants";
import { getDb } from "~/db";
import { household } from "~/db/schema";
import { comparePasswordHash } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  if (!body.household || !body.password) {
    throw createError({
      statusCode: 403,
      message: "household and password are required",
    });
  }

  const db = await getDb();
  const hhs = await db
    .select()
    .from(household)
    .where(eq(household.householdName, body.household.toLowerCase()));

  if (!hhs || hhs.length != 1) {
    return { err: "Invalid credentials" };
  }
  if (!comparePasswordHash(body.password, hhs[0].password)) {
    return { err: "Invalid credentials" };
  }

  const token = createJwt(hhs[0].id, config.jwtKey);
  setCookie(event, CONSTANTS.JWT_COOKIE_NAME, token);

  return { body: token };
});
