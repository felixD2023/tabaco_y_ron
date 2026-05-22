"""Quita la palabra de unidad (min/mins/minuto(s)/minute(s)) de `tiempo_fumado`.

Recorre TODOS los productos. Si `tiempo_fumado` contiene la palabra de unidad
(en español o inglés, en cualquier caja), la elimina y deja solo el valor
numérico/rango:

    "45- 60 minutes"  -> "45- 60"
    "60 – 90 minutos" -> "60 – 90"
    "120 min"         -> "120"
    "120min."         -> "120"

Idempotente: volver a ejecutarlo no cambia nada. Si tras limpiar el campo queda
vacío, se deja en NULL.

Uso:
    python -m scripts.limpiar_tiempo_fumado            # previsualiza (no escribe)
    python -m scripts.limpiar_tiempo_fumado --apply    # aplica y hace commit
"""

from __future__ import annotations

import asyncio
import re
import sys

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.producto import Producto

# Unidad de tiempo: español/inglés, singular/plural y abreviatura. Longest-first
# para que "minutos" gane sobre "min". Lookbehind/lookahead sobre letras (no \b)
# para capturar también casos pegados a un número como "120min".
RE_UNIDAD = re.compile(
    r"(?<![a-zA-Z])(?:minutos|minutes|minuto|minute|mins|min)(?![a-zA-Z])\.?",
    re.IGNORECASE,
)
RE_WS = re.compile(r"\s+")


def clean_tiempo(val: str) -> str | None:
    out = RE_UNIDAD.sub(" ", val)
    out = RE_WS.sub(" ", out).strip()
    out = out.strip(" -–—,;.")  # separadores sueltos que queden en los extremos
    out = RE_WS.sub(" ", out).strip()
    return out or None


async def main(apply: bool) -> int:
    async with AsyncSessionLocal() as db:
        productos = (
            await db.execute(
                select(Producto)
                .where(Producto.tiempo_fumado.is_not(None))
                .order_by(Producto.nombre)
            )
        ).scalars().all()

        cambios: list[tuple[int, str, str, str | None]] = []
        for p in productos:
            original = p.tiempo_fumado or ""
            nuevo = clean_tiempo(original)
            if nuevo != original:
                cambios.append((p.id, p.nombre, original, nuevo))
                if apply:
                    p.tiempo_fumado = nuevo

        print(f"Productos con tiempo_fumado: {len(productos)}")
        print(f"Requieren limpieza: {len(cambios)}\n")
        for pid, nombre, old, new in cambios:
            shown = "NULL" if new is None else repr(new)
            print(f"  #{pid}  {nombre}")
            print(f"      {old!r}  ->  {shown}")

        if apply:
            await db.commit()
            print(f"\n[OK] {len(cambios)} productos actualizados y confirmados.")
        else:
            print("\n[DRY-RUN] Nada escrito. Ejecuta con --apply para guardar.")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main("--apply" in sys.argv)))
