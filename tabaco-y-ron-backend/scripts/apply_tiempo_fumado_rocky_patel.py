"""Puebla la columna `tiempo_fumado` (string) de los productos Rocky Patel.

Extrae el valor del campo "Tiempo de Fumada" (o "Smoking Time" en EN) del bloque
short-description de cada .txt, lo limpia y lo guarda tal cual ("45- 60 minutes",
"60 – 90 minutos", "120 min", etc.).

Idempotente: solo actualiza filas donde `tiempo_fumado IS NULL`.

Uso:
    python -m scripts.apply_tiempo_fumado_rocky_patel
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
RE_TITLE = re.compile(r'<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)</h1>')
RE_SHORT = re.compile(
    r'<div class="woocommerce-product-details__short-description">(.*?)</div>',
    re.DOTALL,
)


def _clean(s: str) -> str:
    return RE_WS.sub(" ", html.unescape(RE_TAG.sub(" ", s))).strip()


def _normalize_key(name: str) -> str:
    s = unicodedata.normalize("NFKD", name)
    s = s.encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"\bunid(ad)?\.?\b", "und", s)
    s = re.sub(r"\bund\.?\b", "und", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return RE_WS.sub(" ", s).strip()


def _extract_tiempo(short_text: str) -> str | None:
    """Devuelve el string completo después de 'Tiempo de Fumada/Fumado:' o 'Smoking Time:'."""
    stop = (
        r"(?:Fortaleza|Especificaciones|Formato|Format|Dimensiones|"
        r"Dimensions|Tiempo de Fumad[ao]|Smoking Time)\s*:"
    )
    for label in (r"Tiempo de Fumad[ao]", "Smoking Time"):
        pat = rf"{label}\s*:\s*(.+?)(?=\s*(?:{stop})|$)"
        m = re.search(pat, short_text, re.IGNORECASE)
        if m:
            val = m.group(1).strip(" -–—,;.")
            if val:
                # Normalizamos separadores raros del texto plano de Word/web
                val = val.replace("–", "–").replace("—", "–")
                # Truncamos a 60 chars por seguridad (el schema lo limita).
                return val[:60]
    return None


def build_tiempo_map(notes_dir: Path) -> dict[str, str]:
    """{ nombre_producto_normalizado: tiempo_fumado }. Si hay varias muestras, toma la más frecuente."""
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
        tiempo = _extract_tiempo(short_text)
        if not tiempo:
            continue
        bucket.setdefault(_normalize_key(nombre), []).append(tiempo)

    out: dict[str, str] = {}
    for key, vals in bucket.items():
        most_common, _ = Counter(vals).most_common(1)[0]
        out[key] = most_common
    return out


async def main() -> int:
    tiempo_map = build_tiempo_map(NOTES_DIR)
    print(f"Tiempos extraídos: {len(tiempo_map)} productos únicos")

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

        ya_con_tiempo = 0
        actualizados = 0
        sin_match: list[str] = []

        for p in productos:
            if p.tiempo_fumado is not None:
                ya_con_tiempo += 1
                continue
            t = tiempo_map.get(_normalize_key(p.nombre))
            if not t:
                sin_match.append(p.nombre)
                continue
            p.tiempo_fumado = t
            actualizados += 1

        await db.commit()

        print()
        print(f"Productos en BD: {len(productos)}")
        print(f"Ya tenían tiempo_fumado: {ya_con_tiempo}")
        print(f"Actualizados: {actualizados}")
        print(f"Sin match (queda NULL): {len(sin_match)}")
        if sin_match:
            print("\nProductos sin tiempo_fumado:")
            for n in sin_match:
                print(f"  - {n}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
