"""Asigna precio a los productos Rocky Patel a partir de los HTML originales.

Los precios viven en las secciones "productos relacionados" de cada archivo .txt
(no en la página del producto principal). Esta script:

1. Recorre los 60 .txt no vacíos de Rocky Patel.
2. De cada uno extrae los pares (título_related, precio_related).
3. Agrupa por título normalizado y obtiene un precio único (todos coinciden).
4. Para cada Producto Rocky Patel en BD:
   - Si su nombre contiene "caja" → precio se aplica a `precio_caja`.
   - Si no contiene "caja" → se aplica a `precio_individual`.
5. Idempotente: solo modifica filas donde AMBOS precios están NULL.

Uso:
    python -m scripts.apply_prices_rocky_patel
"""

from __future__ import annotations

import asyncio
import re
import sys
import unicodedata
from collections import Counter
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Producto

NOTES_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Productos X Marca\Rocky Patel")
MARCA_NOMBRE = "Rocky Patel"

RE_TITLE = re.compile(r'<h2 class="woocommerce-loop-product__title">([^<]+)</h2>')
RE_BDI = re.compile(r'<span class="price">.*?<bdi>(.*?)</bdi>', re.DOTALL)
RE_TAGS = re.compile(r"<[^>]+>")
RE_NUM = re.compile(r"([\d]+(?:\.\d+)?)")
RE_SPACES = re.compile(r"\s+")


def normalize(name: str) -> str:
    """Normalización agresiva: minúsculas, sin diacríticos, sin punctuation, espacios colapsados.

    Iguala "und" y "unid" (variantes de "unidad").
    """
    s = unicodedata.normalize("NFKD", name)
    s = s.encode("ascii", "ignore").decode("ascii")  # quita acentos
    s = s.lower()
    # Unifica und/unid y variantes
    s = re.sub(r"\bunid(ad)?\.?\b", "und", s)
    s = re.sub(r"\bund\.?\b", "und", s)
    # Reemplaza cualquier no alfanumérico por espacio
    s = re.sub(r"[^a-z0-9]+", " ", s)
    s = RE_SPACES.sub(" ", s).strip()
    return s


def extract_pairs_from_html(html: str) -> list[tuple[str, Decimal]]:
    titles = [
        (m.start(), m.end(), m.group(1)) for m in RE_TITLE.finditer(html)
    ]
    bdis = [(m.start(), m.group(1)) for m in RE_BDI.finditer(html)]
    out: list[tuple[str, Decimal]] = []
    for i, (_, t_end, raw_title) in enumerate(titles):
        next_start = titles[i + 1][0] if i + 1 < len(titles) else len(html)
        chosen = next((b for b in bdis if t_end < b[0] < next_start), None)
        if chosen is None:
            continue
        bdi_text = RE_TAGS.sub("", chosen[1]).replace(",", "")
        m = RE_NUM.search(bdi_text)
        if not m:
            continue
        out.append((RE_SPACES.sub(" ", raw_title).strip(), Decimal(m.group(1))))
    return out


def build_price_map(notes_dir: Path) -> dict[str, Decimal]:
    """Agrega todos los archivos y devuelve { titulo_normalizado: precio_mas_comun }."""
    bucket: dict[str, list[Decimal]] = {}
    for fp in sorted(notes_dir.glob("*.txt")):
        if fp.stat().st_size == 0:
            continue
        html = fp.read_bytes().decode("utf-8", errors="replace")
        for raw_title, price in extract_pairs_from_html(html):
            bucket.setdefault(normalize(raw_title), []).append(price)
    # Para cada título tomamos el precio más común (defensivo contra ruido del HTML).
    out: dict[str, Decimal] = {}
    for key, prices in bucket.items():
        most_common_price, _ = Counter(prices).most_common(1)[0]
        out[key] = most_common_price
    return out


async def main() -> int:
    price_map = build_price_map(NOTES_DIR)
    print(f"Precios extraídos: {len(price_map)} títulos únicos")

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

        sin_match: list[str] = []
        ya_con_precio = 0
        actualizados_caja = 0
        actualizados_individual = 0

        for p in productos:
            if p.precio_caja is not None or p.precio_individual is not None:
                ya_con_precio += 1
                continue
            key = normalize(p.nombre)
            price = price_map.get(key)
            if price is None:
                sin_match.append(p.nombre)
                continue
            es_caja = "caja" in p.nombre.lower()
            if es_caja:
                p.precio_caja = price
                actualizados_caja += 1
            else:
                p.precio_individual = price
                actualizados_individual += 1

        await db.commit()

        print()
        print(f"Productos en BD: {len(productos)}")
        print(f"Ya tenían precio (no se tocaron): {ya_con_precio}")
        print(f"Actualizados (precio_caja):       {actualizados_caja}")
        print(f"Actualizados (precio_individual): {actualizados_individual}")
        print(f"Sin match (precio queda NULL):    {len(sin_match)}")
        if sin_match:
            print("\nProductos sin precio encontrado:")
            for n in sin_match:
                print(f"  - {n}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
