import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, Conflict, NotFound, handleApiError, jsonOk, noContent } from "@/lib/api/errors";
import { userToDTO } from "@/lib/api/serializers";
import { userUpdateSchema } from "@/lib/api/validators";
import { requireAdmin } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import { db, schema } from "@/lib/db/client";
import { roleToDb } from "@/lib/db/schema";
import { isUniqueViolation } from "../route";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx): Promise<number> {
  const { id } = await ctx.params;
  const n = Number.parseInt(id, 10);
  if (!Number.isFinite(n) || n <= 0) throw BadRequest("ID inválido");
  return n;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const id = await parseId(ctx);
    const body = userUpdateSchema.parse(await req.json());

    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    if (!user) throw NotFound("Usuario no encontrado");

    const patch: Partial<typeof schema.users.$inferInsert> = {};
    if (body.nombre != null) patch.nombre = body.nombre;
    if (body.email != null) patch.email = body.email;
    if (body.role != null) patch.role = roleToDb(body.role);
    if (body.password != null) patch.hashedPassword = await hashPassword(body.password);

    if (Object.keys(patch).length === 0) return jsonOk(userToDTO(user));

    try {
      const [updated] = await db.update(schema.users).set(patch).where(eq(schema.users.id, id)).returning();
      return jsonOk(userToDTO(updated));
    } catch (e) {
      if (isUniqueViolation(e)) throw Conflict(`Ya existe User con email='${body.email ?? user.email}'`);
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const id = await parseId(ctx);
    const deleted = await db.delete(schema.users).where(eq(schema.users.id, id)).returning({ id: schema.users.id });
    if (deleted.length === 0) throw NotFound("Usuario no encontrado");
    return noContent();
  } catch (err) {
    return handleApiError(err);
  }
}
