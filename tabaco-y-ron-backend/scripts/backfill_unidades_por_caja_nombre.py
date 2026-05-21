"""Backfill de `unidades_por_caja` desde el texto "Caja de X unid" en el nombre.

Recorre TODOS los productos. Para cada nombre que contenga un patrón tipo
"Caja de 20 unid", "Caja de 20 und" o "Caja 10 Unid":
  - extrae el número como `unidades_por_caja`
  - elimina ese fragmento del `nombre`

No toca samplers ni nombres sin el patrón "Caja ... unid/und". No confunde
"Box Pressed" (forma del puro) porque solo busca la palabra española "Caja".

Idempotente: tras correr una vez, el patrón ya no está en el nombre, así que
una segunda ejecución no cambia nada.

Por seguridad corre en modo dry-run (no escribe). Para aplicar:
    python -m scripts.backfill_unidades_por_caja_nombre --apply

Dry-run (solo muestra lo que haría):
    python -m scripts.backfill_unidades_por_caja_nombre
"""

from __future__ import annotations

import asyncio
import re
import sys

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.producto import Producto

# "Caja [de] <n> unid|und|unidad(es)" -> captura n. No matchea "Box Pressed".
RE_CAJA = re.compile(r"\bcaja\s+(?:de\s+)?(\d+)\s+un[a-z]*\.?", re.IGNORECASE)
RE_WS = re.compile(r"\s+")


def _limpiar_nombre(nombre: str) -> str:
    sin = RE_CAJA.sub(" ", nombre)
    return RE_WS.sub(" ", sin).strip(" -–—,;.")


async def main() -> int:
    apply = "--apply" in sys.argv[1:]
    modo = "APLICANDO CAMBIOS" if apply else "DRY-RUN (no escribe)"
    print(f"== {modo} ==\n")

    async with AsyncSessionLocal() as db:
        productos = (
            await db.execute(select(Producto).order_by(Producto.id))
        ).scalars().all()

        actualizados = 0

        for p in productos:
            m = RE_CAJA.search(p.nombre)
            if not m:
                continue

            unidades = int(m.group(1))
            nombre_nuevo = _limpiar_nombre(p.nombre)

            print(f"[{p.id}]")
            print(f"  nombre:  {p.nombre!r}")
            print(f"        -> {nombre_nuevo!r}")
            print(f"  unidades_por_caja: {p.unidades_por_caja} -> {unidades}")

            if apply:
                p.unidades_por_caja = unidades
                p.nombre = nombre_nuevo
            actualizados += 1

        if apply:
            await db.commit()

        print()
        print(f"Productos totales: {len(productos)}")
        print(f"{'Actualizados' if apply else 'Coincidencias (se actualizarían)'}: {actualizados}")
        if not apply:
            print("\nNada escrito. Ejecuta con --apply para confirmar.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
