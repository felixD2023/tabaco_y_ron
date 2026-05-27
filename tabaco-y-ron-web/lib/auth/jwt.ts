import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";

const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
  throw new Error("JWT_SECRET_KEY no está definida");
}
const secretBytes = new TextEncoder().encode(secret);

const expMinutes = Number(process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES ?? 60);

export type AccessPayload = {
  sub: string;
  role?: string;
  exp: number;
};

export async function createAccessToken(
  subject: string | number,
  extra: Record<string, unknown> = {},
): Promise<string> {
  return new SignJWT({ ...extra })
    .setProtectedHeader({ alg: ALG })
    .setSubject(String(subject))
    .setExpirationTime(`${expMinutes}m`)
    .sign(secretBytes);
}

export async function decodeAccessToken(token: string): Promise<AccessPayload> {
  const { payload } = await jwtVerify(token, secretBytes, { algorithms: [ALG] });
  if (typeof payload.sub !== "string") {
    throw new Error("Token sin sub");
  }
  return payload as AccessPayload;
}
