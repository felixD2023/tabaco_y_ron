import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db, schema } from "@/lib/db/client";
import { Unauthorized, Forbidden } from "@/lib/api/errors";
import { roleFromDb, type ApiUserRole } from "@/lib/db/schema";
import { decodeAccessToken } from "./jwt";

export type AuthUser = typeof schema.users.$inferSelect;

async function extractToken(req: NextRequest): Promise<string> {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    throw Unauthorized();
  }
  return header.slice(7).trim();
}

export async function getCurrentUser(req: NextRequest): Promise<AuthUser> {
  const token = await extractToken(req);
  let userId: number;
  try {
    const payload = await decodeAccessToken(token);
    userId = Number.parseInt(payload.sub, 10);
    if (!Number.isFinite(userId)) throw new Error("sub no es entero");
  } catch {
    throw Unauthorized();
  }
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  if (!user) throw Unauthorized();
  return user;
}

export async function requireRoles(
  req: NextRequest,
  roles: ReadonlyArray<ApiUserRole>,
): Promise<AuthUser> {
  const user = await getCurrentUser(req);
  if (!roles.includes(roleFromDb(user.role))) throw Forbidden();
  return user;
}

export const requireAdmin = (req: NextRequest) => requireRoles(req, ["admin"]);
export const requireAdminOrGestor = (req: NextRequest) =>
  requireRoles(req, ["admin", "gestor"]);
