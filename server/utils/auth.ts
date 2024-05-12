import jwt from "jsonwebtoken";
import { H3Event, EventHandlerRequest } from "h3";
import CONSTANTS from "~/constants";

export function createJwt(key: string): string {
  return jwt.sign(
    {
      iss: "grocery",
    },
    key,
    {
      expiresIn: "30d",
    },
  );
}

export function verifyJwt(token: string, key: string): boolean {
  try {
    const decoded = jwt.verify(token, key);
    if (decoded) return true;
    return false;
  } catch (err) {
    return false;
  }
}

export function requireAuth(event: H3Event<EventHandlerRequest>): void {
  const config = useRuntimeConfig(event);
  const token = getCookie(event, CONSTANTS.JWT_COOKIE_NAME);
  if (!token) {
    throw createError({
      statusCode: 403,
      message: "Not signed in",
    });
  }
  const verified = verifyJwt(token, config.jwtKey);
  if (!verified) {
    throw createError({
      statusCode: 403,
      message: "Not signed in",
    });
  }
}
