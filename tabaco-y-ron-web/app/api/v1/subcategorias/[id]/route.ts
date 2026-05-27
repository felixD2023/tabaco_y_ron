import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, Conflict, NotFound, handleApiError, jsonOk, noContent } from "@/lib/api/errors";
import { subcategoriaToDTO } from "@/lib/api/serializers";
import { subcategoriaUpdateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { db, schema } from "@/lib/db/client";
import { isUniqueViolation } from "../../users/route";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx): Promise<number> {
  const { id } = await ctx.params;
  const n = Number.parseInt(id, 10);
  if (!Number.isFinite(n) || n <= 0) throw BadRequest("ID inválido");
  return n;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const id = await parseId(ctx);
    const [row] = await db.select().from(schema.subcategorias).where(eq(schema.subcategorias.id, id)).limit(1);
    if (!row) throw NotFound("Subcategoría no encontrada");
    return jsonOk(subcategoriaToDTO(row));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const body = subcategoriaUpdateSchema.parse(await req.json());

    const [existing] = await db.select().from(schema.subcategorias).where(eq(schema.subcategorias.id, id)).limit(1);
    if (!existing) throw NotFound("Subcategoría no encontrada");

    if (body.marca_id != null && body.marca_id !== existing.marcaId) {
      const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, body.marca_id)).limit(1);
      if (!marca) throw NotFound("Marca destino no encontrada");
    }

    const patch: Partial<typeof schema.subcategorias.$inferInsert> = {};
    if (body.nombre != null) patch.nombre = body.nombre;
    if (body.marca_id != null) patch.marcaId = body.marca_id;

    if (Object.keys(patch).length === 0) return jsonOk(subcategoriaToDTO(existing));

    try {
      const [updated] = await db.update(schema.subcategorias).set(patch).where(eq(schema.subcategorias.id, id)).returning();
      return jsonOk(subcategoriaToDTO(updated));
    } catch (e) {
      if (isUniqueViolation(e)) {
        const nombre = body.nombre ?? existing.nombre;
        const mid = body.marca_id ?? existing.marcaId;
        throw Conflict(`Ya existe Subcategoria con nombre+marca=('${nombre}', ${mid})`);
      }
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const deleted = await db.delete(schema.subcategorias).where(eq(schema.subcategorias.id, id)).returning({ id: schema.subcategorias.id });
    if (deleted.length === 0) throw NotFound("Subcategoría no encontrada");
    return noContent();
  } catch (err) {
    return handleApiError(err);
  }
}
