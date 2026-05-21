"""Merge de productos 'caja' + 'individual' que son el mismo cigarro en dos presentaciones.

Detecta pares por nombre base (quitando el sufijo 'Caja de N und/unid') y:
  1. Mueve `precio_individual` y `precio_descuento_individual` del producto individual
     al producto caja (que se queda como principal).
  2. Crea una fila en `producto_imagenes` con tipo='tabaco_suelto', orden=1, copiando
     la `imagen` del individual (o NULL si no tenía).
  3. Borra la fila del producto individual.

Idempotente: si el caja ya tiene precio_individual y ya tiene una imagen tabaco_suelto,
se salta el par (asume mergeado).

Uso:
    python -m scripts.merge_caja_individual
"""

from __future__ import annotations

import asyncio
import re
import sys
import unicodedata

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Producto
from app.models.producto_imagen import ProductoImagen

MARCA_NOMBRE = "Rocky Patel"


def normalize_base(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii").lower()
    # Quita sufijo "Caja de N und/unid/unidades".
    s = re.sub(
        r"\s*-?\s*caja\s+(de\s+)?\d+\s*(und|unid|unidades)\.?\s*$", "", s
    )
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


async def main() -> int:
    async with AsyncSessionLocal() as db:
        marca = (
            await db.execute(select(Marca).where(Marca.nombre == MARCA_NOMBRE))
        ).scalar_one_or_none()
        if marca is None:
            print(f"[ABORTAR] No existe la marca '{MARCA_NOMBRE}'", file=sys.stderr)
            return 1

        productos = list(
            (
                await db.execute(
                    select(Producto)
                    .where(Producto.marca_id == marca.id)
                    .order_by(Producto.nombre)
                )
            )
            .scalars()
            .all()
        )

        # Agrupar por nombre base.
        groups: dict[str, list[Producto]] = {}
        for p in productos:
            groups.setdefault(normalize_base(p.nombre), []).append(p)

        merged = 0
        already = 0
        for base, items in groups.items():
            if len(items) < 2:
                continue
            cajas = [p for p in items if "caja" in p.nombre.lower()]
            inds = [p for p in items if "caja" not in p.nombre.lower()]
            if not cajas or not inds:
                continue
            caja = cajas[0]
            ind = inds[0]

            # Idempotencia: si la caja ya tiene precio_individual, asumimos mergeado.
            if caja.precio_individual is not None:
                already += 1
                print(f"  [skip ya mergeado] {caja.nombre}")
                continue

            # 1. Mover precios del individual a la caja.
            caja.precio_individual = ind.precio_individual
            caja.precio_descuento_individual = ind.precio_descuento_individual

            # 2. Crear imagen de tipo tabaco_suelto.
            db.add(
                ProductoImagen(
                    producto_id=caja.id,
                    url=ind.imagen,  # puede ser None
                    tipo="tabaco_suelto",
                    orden=1,
                )
            )

            # 3. Borrar el producto individual.
            await db.delete(ind)
            merged += 1
            print(
                f"  [merge] [{caja.id}] {caja.nombre}\n"
                f"          + ${caja.precio_caja} caja / ${caja.precio_individual} individual\n"
                f"          (del individual id={ind.id})"
            )

        await db.commit()
        print()
        print(f"Mergeados: {merged}")
        print(f"Ya estaban mergeados (skip): {already}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
