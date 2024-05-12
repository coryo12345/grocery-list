import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event);
  } catch (err) {
    return false;
  }
  return true;
});
