import { and, asc, eq, ilike, type SQL } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { Conflict, NotFound, handleApiError, jsonOk } from "@/lib/api/errors";
import { subcategoriaToDTO } from "@/lib/api/serializers";
import { subcategoriaCreateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { db, schema } from "@/lib/db/client";
import { isUniqueViolation } from "../users/route";
import { parseLimit } from "../marcas/route";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const marcaIdRaw = url.searchParams.get("marca_id");
    const search = url.searchParams.get("search");
    const limit = parseLimit(url.searchParams.get("limit"), 1, 200);
    const offset = parseLimit(url.searchParams.get("offset"), 0, Number.MAX_SAFE_INTEGER);

    const filters: SQL[] = [];
    if (marcaIdRaw) {
      const n = Number(marcaIdRaw);
      if (Number.isFinite(n)) filters.push(eq(schema.subcategorias.marcaId, n));
    }
    if (search) filters.push(ilike(schema.subcategorias.nombre, `%${search}%`));

    let query = db.select().from(schema.subcategorias).$dynamic();
    if (filters.length) query = query.where(and(...filters));
    query = query.orderBy(asc(schema.subcategorias.nombre));
    if (limit != null) query = query.limit(limit);
    if (offset != null) query = query.offset(offset);

    const rows = await query;
    return jsonOk(rows.map(subcategoriaToDTO));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrGestor(req);
    const body = subcategoriaCreateSchema.parse(await req.json());

    const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, body.marca_id)).limit(1);
    if (!marca) throw NotFound("Marca no encontrada");

    try {
      const [created] = await db
        .insert(schema.subcategorias)
        .values({ nombre: body.nombre, marcaId: body.marca_id })
        .returning();
      return jsonOk(subcategoriaToDTO(created), 201);
    } catch (e) {
      if (isUniqueViolation(e)) throw Conflict(`Ya existe Subcategoria con nombre+marca=('${body.nombre}', ${body.marca_id})`);
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
