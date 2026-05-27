import { and, asc, count, desc, eq, gte, ilike, inArray, isNotNull, lte, sql, type SQL } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, NotFound, handleApiError, jsonOk } from "@/lib/api/errors";
import { getProductoDTOs } from "@/lib/api/productos-helpers";
import { productoCreateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { db, schema } from "@/lib/db/client";
import { fortalezaToDb, type ApiFortaleza } from "@/lib/db/schema";

const SORTS = new Set(["name", "precio_asc", "precio_desc", "rating_desc"] as const);
type Sort = "name" | "precio_asc" | "precio_desc" | "rating_desc";

const FORTALEZAS = new Set(["suave", "medio", "fuerte", "suave_medio", "medio_fuerte"]);

function intArrayParam(url: URL, key: string): number[] {
  return url.searchParams.getAll(key).map((v) => Number(v)).filter((n) => Number.isFinite(n) && n > 0);
}

function strArrayParam(url: URL, key: string): string[] {
  return url.searchParams.getAll(key);
}

function numParam(url: URL, key: string): number | undefined {
  const v = url.searchParams.get(key);
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, numParam(url, "page") ?? 1);
    const pageSize = Math.min(100, Math.max(1, numParam(url, "page_size") ?? 24));
    const sortRaw = url.searchParams.get("sort") ?? "name";
    const sort: Sort = SORTS.has(sortRaw as Sort) ? (sortRaw as Sort) : "name";
    const q = url.searchParams.get("q")?.trim() || undefined;
    const marcaIds = intArrayParam(url, "marca_id");
    const subcatIds = intArrayParam(url, "subcategoria_id");
    const fortalezas = strArrayParam(url, "fortaleza")
      .filter((f) => FORTALEZAS.has(f))
      .map((f) => fortalezaToDb(f as ApiFortaleza));
    const precioMin = numParam(url, "precio_min");
    const precioMax = numParam(url, "precio_max");
    const cepoMin = numParam(url, "cepo_min");
    const cepoMax = numParam(url, "cepo_max");
    const largoMin = numParam(url, "largo_min");
    const largoMax = numParam(url, "largo_max");
    const ratingMin = numParam(url, "rating_min");
    const soloExistentes = url.searchParams.get("solo_existentes") === "true";

    // Precio efectivo = COALESCE(precio_caja, precio_individual)
    const precioEfectivo = sql<number>`COALESCE(${schema.productos.precioCaja}, ${schema.productos.precioIndividual})`;

    const filters: SQL[] = [];
    if (q) filters.push(ilike(schema.productos.nombre, `%${q}%`));
    if (marcaIds.length) filters.push(inArray(schema.productos.marcaId, marcaIds));
    if (subcatIds.length) filters.push(inArray(schema.productos.subcategoriaId, subcatIds));
    if (fortalezas.length) filters.push(inArray(schema.productos.fortaleza, fortalezas));
    if (precioMin != null) filters.push(sql`${precioEfectivo} >= ${precioMin}`);
    if (precioMax != null) filters.push(sql`${precioEfectivo} <= ${precioMax}`);
    if (cepoMin != null) filters.push(gte(schema.productos.cepo, cepoMin));
    if (cepoMax != null) filters.push(lte(schema.productos.cepo, cepoMax));
    if (largoMin != null) filters.push(gte(schema.productos.largoMm, largoMin));
    if (largoMax != null) filters.push(lte(schema.productos.largoMm, largoMax));
    if (ratingMin != null) filters.push(gte(schema.productos.rating, ratingMin));
    if (soloExistentes) filters.push(eq(schema.productos.existencia, true));

    const whereClause = filters.length ? and(...filters) : undefined;

    // Total
    const totalRow = await db
      .select({ value: count() })
      .from(schema.productos)
      .where(whereClause);
    const total = Number(totalRow[0]?.value ?? 0);

    // Orden: cajas (0), individuales (1), sin precio (2); luego sort.
    const grupoPrecio = sql<number>`CASE
      WHEN ${schema.productos.precioCaja} IS NOT NULL THEN 0
      WHEN ${schema.productos.precioIndividual} IS NOT NULL THEN 1
      ELSE 2
    END`;

    const orderBy = (() => {
      switch (sort) {
        case "name":
          return [asc(grupoPrecio), asc(schema.productos.nombre), asc(schema.productos.id)];
        case "precio_asc":
          return [
            asc(grupoPrecio),
            sql`${precioEfectivo} ASC NULLS LAST`,
            asc(schema.productos.id),
          ];
        case "precio_desc":
          return [
            asc(grupoPrecio),
            sql`${precioEfectivo} DESC NULLS LAST`,
            asc(schema.productos.id),
          ];
        case "rating_desc":
          return [
            asc(grupoPrecio),
            sql`${schema.productos.rating} DESC NULLS LAST`,
            asc(schema.productos.id),
          ];
      }
    })();

    let query = db.select().from(schema.productos).$dynamic();
    if (whereClause) query = query.where(whereClause);
    query = query.orderBy(...orderBy).limit(pageSize).offset((page - 1) * pageSize);
    const rows = await query;

    const items = await getProductoDTOs(rows);
    const pages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

    return jsonOk({ items, total, page, page_size: pageSize, pages });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrGestor(req);
    const body = productoCreateSchema.parse(await req.json());

    // Validar marca + subcategoría coherente
    if (body.subcategoria_id != null) {
      const [pair] = await db
        .select({ id: schema.subcategorias.id })
        .from(schema.subcategorias)
        .where(
          and(
            eq(schema.subcategorias.id, body.subcategoria_id),
            eq(schema.subcategorias.marcaId, body.marca_id),
          ),
        )
        .limit(1);
      if (!pair) {
        const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, body.marca_id)).limit(1);
        if (!marca) throw NotFound("Marca no encontrada");
        const [sub] = await db.select({ id: schema.subcategorias.id }).from(schema.subcategorias).where(eq(schema.subcategorias.id, body.subcategoria_id)).limit(1);
        if (!sub) throw NotFound("Subcategoría no encontrada");
        throw BadRequest("La subcategoría no pertenece a la marca indicada");
      }
    } else {
      const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, body.marca_id)).limit(1);
      if (!marca) throw NotFound("Marca no encontrada");
    }

    const [created] = await db
      .insert(schema.productos)
      .values({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        precioIndividual: body.precio_individual ?? null,
        precioCaja: body.precio_caja ?? null,
        precioDescuentoIndividual: body.precio_descuento_individual ?? null,
        precioDescuentoCaja: body.precio_descuento_caja ?? null,
        fortaleza: body.fortaleza ? fortalezaToDb(body.fortaleza) : null,
        tiempoFumado: body.tiempo_fumado ?? null,
        cepo: body.cepo ?? null,
        largoMm: body.largo_mm ?? null,
        vitola: body.vitola ?? null,
        unidadesPorCaja: body.unidades_por_caja ?? null,
        rating: body.rating ?? null,
        existencia: body.existencia,
        disponibleCaja: body.disponible_caja,
        disponibleIndividual: body.disponible_individual,
        imagen: body.imagen ?? null,
        marcaId: body.marca_id,
        subcategoriaId: body.subcategoria_id ?? null,
      })
      .returning();

    if (body.imagenes.length) {
      await db.insert(schema.productoImagenes).values(
        body.imagenes.map((img, idx) => ({
          productoId: created.id,
          url: img.url ?? null,
          tipo: img.tipo || "detalle",
          orden: typeof img.orden === "number" ? img.orden : idx,
        })),
      );
    }

    const [dto] = await getProductoDTOs([created]);
    void isNotNull; // keep import tree-shake friendly
    return jsonOk(dto, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
