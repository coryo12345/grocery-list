import CONSTANTS from "~/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const token = getCookie(event, CONSTANTS.JWT_COOKIE_NAME);
  if (!token) return false;
  const verified = verifyJwt(token, config.jwtKey);
  return verified;
});
