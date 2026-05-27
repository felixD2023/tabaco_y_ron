import { and, desc, eq, type SQL } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { NotFound, handleApiError, jsonOk } from "@/lib/api/errors";
import { valoracionToDTO } from "@/lib/api/serializers";
import { valoracionCreateSchema } from "@/lib/api/validators";
import { db, schema } from "@/lib/db/client";
import { parseLimit } from "../marcas/route";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productoIdRaw = url.searchParams.get("producto_id");
    const limit = parseLimit(url.searchParams.get("limit"), 1, 200);
    const offset = parseLimit(url.searchParams.get("offset"), 0, Number.MAX_SAFE_INTEGER);

    const filters: SQL[] = [];
    if (productoIdRaw) {
      const n = Number(productoIdRaw);
      if (Number.isFinite(n)) filters.push(eq(schema.valoraciones.productoId, n));
    }

    let query = db.select().from(schema.valoraciones).$dynamic();
    if (filters.length) query = query.where(and(...filters));
    query = query.orderBy(desc(schema.valoraciones.createdAt));
    if (limit != null) query = query.limit(limit);
    if (offset != null) query = query.offset(offset);

    const rows = await query;
    return jsonOk(rows.map(valoracionToDTO));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = valoracionCreateSchema.parse(await req.json());
    const [producto] = await db
      .select({ id: schema.productos.id })
      .from(schema.productos)
      .where(eq(schema.productos.id, body.producto_id))
      .limit(1);
    if (!producto) throw NotFound("Producto no encontrado");

    const [created] = await db
      .insert(schema.valoraciones)
      .values({
        rating: body.rating,
        email: body.email,
        valoracion: body.valoracion,
        productoId: body.producto_id,
      })
      .returning();

    return jsonOk(valoracionToDTO(created), 201);
  } catch (err) {
    return handleApiError(err);
  }
}
