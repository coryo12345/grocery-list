import jwt from "jsonwebtoken";
import { H3Event, EventHandlerRequest } from "h3";
import CONSTANTS from "~/constants";
import * as bcrypt from "bcrypt";

interface GroceryJwtPayload {
  householdId: number;
}

export function createJwt(householdId: number, key: string): string {
  return jwt.sign(
    {
      iss: "grocery",
      householdId,
    } as GroceryJwtPayload,
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

export function requireAuth(event: H3Event<EventHandlerRequest>) {
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

  // we've already verified at this point
  return jwt.decode(token) as GroceryJwtPayload;
}

export function hashPassword(pw: string) {
  const salt = bcrypt.genSaltSync(10);
  const encypted = bcrypt.hashSync(pw, salt);
  return encypted;
}

export function comparePasswordHash(pw: string, hashed: string) {
  return bcrypt.compareSync(pw, hashed);
}
