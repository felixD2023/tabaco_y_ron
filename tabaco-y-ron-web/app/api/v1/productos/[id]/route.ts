import { and, asc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { BadRequest, NotFound, handleApiError, jsonOk, noContent } from "@/lib/api/errors";
import { getProductoDTO, getProductoDTOs } from "@/lib/api/productos-helpers";
import { valoracionMiniToDTO } from "@/lib/api/serializers";
import { productoUpdateSchema } from "@/lib/api/validators";
import { requireAdminOrGestor } from "@/lib/auth/guard";
import { db, schema } from "@/lib/db/client";
import { fortalezaToDb } from "@/lib/db/schema";

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
    const dto = await getProductoDTO(id);
    if (!dto) throw NotFound("Producto no encontrado");
    const vals = await db
      .select()
      .from(schema.valoraciones)
      .where(eq(schema.valoraciones.productoId, id))
      .orderBy(asc(schema.valoraciones.id));
    return jsonOk({ ...dto, valoraciones: vals.map(valoracionMiniToDTO) });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const raw = (await req.json()) as Record<string, unknown>;
    const body = productoUpdateSchema.parse(raw);

    const [existing] = await db.select().from(schema.productos).where(eq(schema.productos.id, id)).limit(1);
    if (!existing) throw NotFound("Producto no encontrado");

    // Validar coherencia marca/subcat si llega alguno de los dos
    const newMarca = body.marca_id ?? existing.marcaId;
    const newSub = body.subcategoria_id !== undefined ? body.subcategoria_id : existing.subcategoriaId;
    if (body.marca_id !== undefined || body.subcategoria_id !== undefined) {
      if (newSub != null) {
        const [pair] = await db
          .select({ id: schema.subcategorias.id })
          .from(schema.subcategorias)
          .where(and(eq(schema.subcategorias.id, newSub), eq(schema.subcategorias.marcaId, newMarca)))
          .limit(1);
        if (!pair) {
          const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, newMarca)).limit(1);
          if (!marca) throw NotFound("Marca no encontrada");
          const [sub] = await db.select({ id: schema.subcategorias.id }).from(schema.subcategorias).where(eq(schema.subcategorias.id, newSub)).limit(1);
          if (!sub) throw NotFound("Subcategoría no encontrada");
          throw BadRequest("La subcategoría no pertenece a la marca indicada");
        }
      } else {
        const [marca] = await db.select({ id: schema.marcas.id }).from(schema.marcas).where(eq(schema.marcas.id, newMarca)).limit(1);
        if (!marca) throw NotFound("Marca no encontrada");
      }
    }

    const patch: Partial<typeof schema.productos.$inferInsert> = {};
    const has = (k: string) => Object.prototype.hasOwnProperty.call(raw, k);
    if (has("nombre") && body.nombre != null) patch.nombre = body.nombre;
    if (has("descripcion")) patch.descripcion = body.descripcion ?? null;
    if (has("precio_individual")) patch.precioIndividual = body.precio_individual ?? null;
    if (has("precio_caja")) patch.precioCaja = body.precio_caja ?? null;
    if (has("precio_descuento_individual")) patch.precioDescuentoIndividual = body.precio_descuento_individual ?? null;
    if (has("precio_descuento_caja")) patch.precioDescuentoCaja = body.precio_descuento_caja ?? null;
    if (has("fortaleza")) patch.fortaleza = body.fortaleza ? fortalezaToDb(body.fortaleza) : null;
    if (has("tiempo_fumado")) patch.tiempoFumado = body.tiempo_fumado ?? null;
    if (has("cepo")) patch.cepo = body.cepo ?? null;
    if (has("largo_mm")) patch.largoMm = body.largo_mm ?? null;
    if (has("vitola")) patch.vitola = body.vitola ?? null;
    if (has("unidades_por_caja")) patch.unidadesPorCaja = body.unidades_por_caja ?? null;
    if (has("rating")) patch.rating = body.rating ?? null;
    if (has("existencia") && body.existencia != null) patch.existencia = body.existencia;
    if (has("disponible_caja") && body.disponible_caja != null) patch.disponibleCaja = body.disponible_caja;
    if (has("disponible_individual") && body.disponible_individual != null) patch.disponibleIndividual = body.disponible_individual;
    if (has("imagen")) patch.imagen = body.imagen ?? null;
    if (has("marca_id") && body.marca_id != null) patch.marcaId = body.marca_id;
    if (has("subcategoria_id")) patch.subcategoriaId = body.subcategoria_id ?? null;

    if (Object.keys(patch).length > 0) {
      await db.update(schema.productos).set(patch).where(eq(schema.productos.id, id));
    }

    // Reemplazar galería si llegó la clave "imagenes" explícitamente
    if (has("imagenes")) {
      const imagenes = body.imagenes ?? [];
      await db.delete(schema.productoImagenes).where(eq(schema.productoImagenes.productoId, id));
      if (imagenes.length) {
        await db.insert(schema.productoImagenes).values(
          imagenes.map((img, idx) => ({
            productoId: id,
            url: img.url ?? null,
            tipo: img.tipo || "detalle",
            orden: typeof img.orden === "number" ? img.orden : idx,
          })),
        );
      }
    }

    const [refreshed] = await db.select().from(schema.productos).where(eq(schema.productos.id, id)).limit(1);
    const [dto] = await getProductoDTOs([refreshed]);
    return jsonOk(dto);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdminOrGestor(req);
    const id = await parseId(ctx);
    const deleted = await db.delete(schema.productos).where(eq(schema.productos.id, id)).returning({ id: schema.productos.id });
    if (deleted.length === 0) throw NotFound("Producto no encontrado");
    return noContent();
  } catch (err) {
    return handleApiError(err);
  }
}
