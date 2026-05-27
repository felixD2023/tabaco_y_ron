import { asc, ilike, inArray } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, Conflict, handleApiError, jsonOk } from "@/lib/api/errors";
import { buildMarcasDTOs } from "@/lib/api/marcas-helpers";
import { marcaCreateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { db, schema } from "@/lib/db/client";
import { isUniqueViolation } from "../users/route";

function parseLimit(val: string | null, min: number, max: number): number | undefined {
  if (val == null) return undefined;
  const n = Number(val);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const orderBy = url.searchParams.get("order_by") ?? "nombre";
    const limit = parseLimit(url.searchParams.get("limit"), 1, 200);
    const offset = parseLimit(url.searchParams.get("offset"), 0, Number.MAX_SAFE_INTEGER);

    const order = orderBy === "id" ? asc(schema.marcas.id) : asc(schema.marcas.nombre);

    let query = db.select().from(schema.marcas).$dynamic();
    if (search) query = query.where(ilike(schema.marcas.nombre, `%${search}%`));
    query = query.orderBy(order);
    if (limit != null) query = query.limit(limit);
    if (offset != null) query = query.offset(offset);
    const rows = await query;

    const dtos = await buildMarcasDTOs(rows);
    return jsonOk(dtos);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrGestor(req);
    const body = marcaCreateSchema.parse(await req.json());
    try {
      const [created] = await db
        .insert(schema.marcas)
        .values({ nombre: body.nombre, imagen: body.imagen ?? null })
        .returning();
      const dtos = await buildMarcasDTOs([created]);
      return jsonOk(dtos[0], 201);
    } catch (e) {
      if (isUniqueViolation(e)) throw Conflict(`Ya existe Marca con nombre='${body.nombre}'`);
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export { isUniqueViolation };
export { parseLimit };

// Used internally by bulk endpoint
export async function bulkCreateMarcas(items: { nombre: string; imagen?: string | null }[]) {
  const nombres = items.map((m) => m.nombre);
  const duplicadosInternos = nombres.filter((n, i) => nombres.indexOf(n) !== i);
  if (duplicadosInternos.length) {
    throw BadRequest(`Nombres duplicados en la petición: ${[...new Set(duplicadosInternos)].sort()}`);
  }
  const existentes = await db
    .select({ nombre: schema.marcas.nombre })
    .from(schema.marcas)
    .where(inArray(schema.marcas.nombre, nombres));
  if (existentes.length) {
    throw Conflict(`Ya existen marcas con estos nombres: ${existentes.map((e) => e.nombre)}`);
  }
  try {
    const created = await db
      .insert(schema.marcas)
      .values(items.map((m) => ({ nombre: m.nombre, imagen: m.imagen ?? null })))
      .returning();
    return await buildMarcasDTOs(created);
  } catch (e) {
    if (isUniqueViolation(e)) throw Conflict("Ya existen marcas con esos nombres");
    throw e;
  }
}
