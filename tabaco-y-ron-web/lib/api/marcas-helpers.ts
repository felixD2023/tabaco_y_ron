import { count, eq, inArray } from "drizzle-orm";

import { db, schema } from "@/lib/db/client";
import { marcaToDTO, type MarcaDTO } from "./serializers";

export async function buildMarcaDTO(marcaId: number): Promise<MarcaDTO | null> {
  const [marca] = await db.select().from(schema.marcas).where(eq(schema.marcas.id, marcaId)).limit(1);
  if (!marca) return null;
  const subs = await db
    .select()
    .from(schema.subcategorias)
    .where(eq(schema.subcategorias.marcaId, marcaId));
  const [{ value }] = await db
    .select({ value: count() })
    .from(schema.productos)
    .where(eq(schema.productos.marcaId, marcaId));
  return marcaToDTO(marca, subs, Number(value));
}

export async function buildMarcasDTOs(rows: (typeof schema.marcas.$inferSelect)[]): Promise<MarcaDTO[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const subs = await db
    .select()
    .from(schema.subcategorias)
    .where(inArray(schema.subcategorias.marcaId, ids));
  const counts = await db
    .select({ marcaId: schema.productos.marcaId, value: count() })
    .from(schema.productos)
    .where(inArray(schema.productos.marcaId, ids))
    .groupBy(schema.productos.marcaId);
  const countMap = new Map(counts.map((c) => [c.marcaId, Number(c.value)]));
  const subsByMarca = new Map<number, (typeof schema.subcategorias.$inferSelect)[]>();
  for (const s of subs) {
    const list = subsByMarca.get(s.marcaId) ?? [];
    list.push(s);
    subsByMarca.set(s.marcaId, list);
  }
  return rows.map((m) => marcaToDTO(m, subsByMarca.get(m.id) ?? [], countMap.get(m.id) ?? 0));
}
