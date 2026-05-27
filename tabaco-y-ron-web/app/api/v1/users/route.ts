import { asc } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { Conflict, handleApiError, jsonOk } from "@/lib/api/errors";
import { userToDTO } from "@/lib/api/serializers";
import { userCreateSchema } from "@/lib/api/validators";
import { requireAdmin } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import { db, schema } from "@/lib/db/client";
import { roleToDb } from "@/lib/db/schema";

function parseLimit(val: string | null, min: number, max: number): number | undefined {
  if (val == null) return undefined;
  const n = Number(val);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const limit = parseLimit(url.searchParams.get("limit"), 1, 200);
    const offset = parseLimit(url.searchParams.get("offset"), 0, Number.MAX_SAFE_INTEGER);

    let query = db.select().from(schema.users).orderBy(asc(schema.users.id)).$dynamic();
    if (limit != null) query = query.limit(limit);
    if (offset != null) query = query.offset(offset);
    const rows = await query;

    return jsonOk(rows.map(userToDTO));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = userCreateSchema.parse(await req.json());
    const hashed = await hashPassword(body.password);

    try {
      const [created] = await db
        .insert(schema.users)
        .values({
          nombre: body.nombre,
          email: body.email,
          hashedPassword: hashed,
          role: roleToDb(body.role),
        })
        .returning();
      return jsonOk(userToDTO(created), 201);
    } catch (e: unknown) {
      if (isUniqueViolation(e)) {
        throw Conflict(`Ya existe User con email='${body.email}'`);
      }
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export function isUniqueViolation(e: unknown): boolean {
  return !!(e && typeof e === "object" && "code" in e && (e as { code: string }).code === "23505");
}
