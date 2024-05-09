import jwt from "jsonwebtoken";

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
