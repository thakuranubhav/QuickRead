import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export type AuthPayload = {
  sub: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthPayload>(token, SECRET_KEY);
  return payload;
}
