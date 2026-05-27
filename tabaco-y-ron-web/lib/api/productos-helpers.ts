import { eq, inArray, asc } from "drizzle-orm";

import { db, schema } from "@/lib/db/client";
import { productoToDTO, type ProductoDTO } from "./serializers";

export async function getProductoDTOs(
  rows: (typeof schema.productos.$inferSelect)[],
): Promise<ProductoDTO[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const imgs = await db
    .select()
    .from(schema.productoImagenes)
    .where(inArray(schema.productoImagenes.productoId, ids))
    .orderBy(asc(schema.productoImagenes.orden));
  const byProducto = new Map<number, (typeof schema.productoImagenes.$inferSelect)[]>();
  for (const i of imgs) {
    const list = byProducto.get(i.productoId) ?? [];
    list.push(i);
    byProducto.set(i.productoId, list);
  }
  return rows.map((p) => productoToDTO(p, byProducto.get(p.id) ?? []));
}

export async function getProductoDTO(id: number): Promise<ProductoDTO | null> {
  const [p] = await db.select().from(schema.productos).where(eq(schema.productos.id, id)).limit(1);
  if (!p) return null;
  const [dto] = await getProductoDTOs([p]);
  return dto;
}
