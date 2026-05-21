"""Puebla la columna `vitola` de los productos Rocky Patel.

Lee los .txt de C:\\Users\\Mage\\Desktop\\TABACO&RON\\Pagina\\Productos X Marca\\Rocky Patel,
extrae el campo "Formato" (o "Format" en EN) del bloque short-description y lo aplica
al producto correspondiente, matcheando por nombre normalizado.

Idempotente: solo actualiza filas donde `vitola IS NULL`.

Uso:
    python -m scripts.apply_vitola_rocky_patel
"""

from __future__ import annotations

import asyncio
import html
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Producto

NOTES_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Productos X Marca\Rocky Patel")
MARCA_NOMBRE = "Rocky Patel"

RE_TAG = re.compile(r"<[^>]+>")
RE_WS = re.compile(r"\s+")
RE_TITLE = re.compile(
    r'<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)</h1>'
)
RE_SHORT = re.compile(
    r'<div class="woocommerce-product-details__short-description">(.*?)</div>',
    re.DOTALL,
)


def _clean(s: str) -> str:
    return RE_WS.sub(" ", html.unescape(RE_TAG.sub(" ", s))).strip()


def _normalize_key(name: str) -> str:
    s = unicodedata.normalize("NFKD", name)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = s.lower()
    s = re.sub(r"\bunid(ad)?\.?\b", "und", s)
    s = re.sub(r"\bund\.?\b", "und", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return RE_WS.sub(" ", s).strip()


def _extract_vitola(short_text: str) -> str | None:
    """Busca 'Formato: X' o 'Format: X' en el bloque de short description ya limpio."""
    stop = (
        r"(?:Fortaleza|Especificaciones|Formato|Format|Dimensiones|"
        r"Dimensions|Tiempo de Fumada|Smoking Time)\s*:"
    )
    for label in ("Formato", "Format"):
        pat = rf"{label}\s*:\s*(.+?)(?=\s*(?:{stop})|$)"
        m = re.search(pat, short_text, re.IGNORECASE)
        if m:
            val = m.group(1).strip(" -–—,;.")
            if val:
                return val
    return None


def build_vitola_map(notes_dir: Path) -> dict[str, str]:
    """Devuelve { nombre_producto_normalizado: vitola }.

    Si un mismo nombre aparece en varios archivos, toma la vitola más común.
    """
    bucket: dict[str, list[str]] = {}
    for fp in sorted(notes_dir.glob("*.txt")):
        if fp.stat().st_size == 0:
            continue
        html_text = fp.read_bytes().decode("utf-8", errors="replace")
        m_title = RE_TITLE.search(html_text)
        if not m_title:
            continue
        nombre = RE_WS.sub(" ", m_title.group(1)).strip()
        m_short = RE_SHORT.search(html_text)
        if not m_short:
            continue
        short_text = _clean(m_short.group(1))
        vitola = _extract_vitola(short_text)
        if not vitola:
            continue
        bucket.setdefault(_normalize_key(nombre), []).append(vitola)

    result: dict[str, str] = {}
    for key, vals in bucket.items():
        most_common, _ = Counter(vals).most_common(1)[0]
        result[key] = most_common
    return result


async def main() -> int:
    vitola_map = build_vitola_map(NOTES_DIR)
    print(f"Vitolas extraídas: {len(vitola_map)} productos únicos")

    async with AsyncSessionLocal() as db:
        marca = (
            await db.execute(select(Marca).where(Marca.nombre == MARCA_NOMBRE))
        ).scalar_one_or_none()
        if marca is None:
            print(f"[ABORTAR] No existe la marca '{MARCA_NOMBRE}'", file=sys.stderr)
            return 1

        productos = (
            await db.execute(
                select(Producto).where(Producto.marca_id == marca.id).order_by(Producto.nombre)
            )
        ).scalars().all()

        ya_con_vitola = 0
        actualizados = 0
        sin_match: list[str] = []

        for p in productos:
            if p.vitola is not None:
                ya_con_vitola += 1
                continue
            v = vitola_map.get(_normalize_key(p.nombre))
            if not v:
                sin_match.append(p.nombre)
                continue
            p.vitola = v
            actualizados += 1

        await db.commit()

        print()
        print(f"Productos en BD: {len(productos)}")
        print(f"Ya tenían vitola (no se tocaron): {ya_con_vitola}")
        print(f"Actualizados con vitola: {actualizados}")
        print(f"Sin match (vitola queda NULL): {len(sin_match)}")
        if sin_match:
            print("\nProductos sin vitola encontrada:")
            for n in sin_match:
                print(f"  - {n}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
