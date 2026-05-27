/**
 * Reescribe URLs absolutas de uploads (heredadas del backend FastAPI en
 * `http://localhost:8000/static/uploads/...`) a paths relativos
 * `/static/uploads/...`, ahora servidos por Next desde `public/`.
 *
 * Idempotente: ya normalizadas no se tocan.
 *
 * Uso:
 *   pnpm tsx scripts/normalize-upload-urls.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { eq, isNotNull } from "drizzle-orm";

import { db, schema } from "@/lib/db/client";

const MATCH = /https?:\/\/[^/]+(\/static\/uploads\/.+)$/;

function normalize(value: string | null): string | null {
  if (!value) return value;
  const m = value.match(MATCH);
  return m ? m[1] : value;
}

async function main() {
  let touchedMarcas = 0;
  let touchedProductos = 0;
  let touchedImagenes = 0;

  const marcas = await db.select().from(schema.marcas).where(isNotNull(schema.marcas.imagen));
  for (const m of marcas) {
    const next = normalize(m.imagen);
    if (next !== m.imagen) {
      await db.update(schema.marcas).set({ imagen: next }).where(eq(schema.marcas.id, m.id));
      touchedMarcas++;
    }
  }

  const productos = await db.select().from(schema.productos).where(isNotNull(schema.productos.imagen));
  for (const p of productos) {
    const next = normalize(p.imagen);
    if (next !== p.imagen) {
      await db.update(schema.productos).set({ imagen: next }).where(eq(schema.productos.id, p.id));
      touchedProductos++;
    }
  }

  const imagenes = await db.select().from(schema.productoImagenes).where(isNotNull(schema.productoImagenes.url));
  for (const i of imagenes) {
    const next = normalize(i.url);
    if (next !== i.url) {
      await db.update(schema.productoImagenes).set({ url: next }).where(eq(schema.productoImagenes.id, i.id));
      touchedImagenes++;
    }
  }

  console.log(`[OK] marcas: ${touchedMarcas}, productos: ${touchedProductos}, producto_imagenes: ${touchedImagenes}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
