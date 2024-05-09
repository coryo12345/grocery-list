import CONSTANTS from "~/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  if (body.password !== config.appPassword) {
    return { err: "invalid password" };
  }

  const token = createJwt(config.jwtKey);

  setCookie(event, CONSTANTS.JWT_COOKIE_NAME, token);

  return { body: token };
});
