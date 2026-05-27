import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, Conflict, NotFound, handleApiError, jsonOk, noContent } from "@/lib/api/errors";
import { buildMarcaDTO } from "@/lib/api/marcas-helpers";
import { marcaUpdateSchema } from "@/lib/api/validators";
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
    const dto = await buildMarcaDTO(id);
    if (!dto) throw NotFound("Marca no encontrada");
    return jsonOk(dto);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const raw = (await req.json()) as Record<string, unknown>;
    const body = marcaUpdateSchema.parse(raw);

    const [existing] = await db.select().from(schema.marcas).where(eq(schema.marcas.id, id)).limit(1);
    if (!existing) throw NotFound("Marca no encontrada");

    const patch: Partial<typeof schema.marcas.$inferInsert> = {};
    if (body.nombre != null) patch.nombre = body.nombre;
    // En el backend FastAPI, "imagen" se actualiza solo si la clave llega presente.
    if (Object.prototype.hasOwnProperty.call(raw, "imagen")) patch.imagen = body.imagen ?? null;

    if (Object.keys(patch).length > 0) {
      try {
        await db.update(schema.marcas).set(patch).where(eq(schema.marcas.id, id));
      } catch (e) {
        if (isUniqueViolation(e)) throw Conflict(`Ya existe Marca con nombre='${body.nombre ?? ""}'`);
        throw e;
      }
    }

    const dto = await buildMarcaDTO(id);
    return jsonOk(dto!);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const deleted = await db.delete(schema.marcas).where(eq(schema.marcas.id, id)).returning({ id: schema.marcas.id });
    if (deleted.length === 0) throw NotFound("Marca no encontrada");
    return noContent();
  } catch (err) {
    return handleApiError(err);
  }
}
