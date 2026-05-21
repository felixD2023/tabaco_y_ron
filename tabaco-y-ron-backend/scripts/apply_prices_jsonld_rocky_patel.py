"""Asigna precio a los productos Rocky Patel sin precio usando el JSON-LD canónico.

Cada archivo HTML de Rocky Patel embebe un bloque `<script type="application/ld+json">`
con un nodo Product que contiene `name` + Offer + UnitPriceSpecification.price (USD).
Esa es la fuente canónica de precio del producto al que pertenece la página.

Regla del usuario:
- Si el nombre del producto contiene "caja" -> precio_caja
- Si no -> precio_individual

Idempotente: solo modifica filas donde AMBOS precios están NULL.

Uso:
    python -m scripts.apply_prices_jsonld_rocky_patel
"""

from __future__ import annotations

import asyncio
import json
import re
import sys
import unicodedata
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Producto

NOTES_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Productos X Marca\Rocky Patel")
MARCA_NOMBRE = "Rocky Patel"

RE_JSONLD = re.compile(
    r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.DOTALL
)
RE_WS = re.compile(r"\s+")


def _normalize_key(name: str) -> str:
    s = unicodedata.normalize("NFKD", name)
    s = s.encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"\bunid(ad)?\.?\b", "und", s)
    s = re.sub(r"\bund\.?\b", "und", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return RE_WS.sub(" ", s).strip()


def _walk_for_product(node, out: list[dict]) -> None:
    """Recoge cada nodo @type=Product encontrado."""
    if isinstance(node, dict):
        t = node.get("@type")
        if t == "Product" or (isinstance(t, list) and "Product" in t):
            out.append(node)
        for v in node.values():
            _walk_for_product(v, out)
    elif isinstance(node, list):
        for x in node:
            _walk_for_product(x, out)


def _extract_price(product_node: dict) -> Decimal | None:
    """Devuelve el precio (priceSpecification.price o offers.price) del nodo Product."""
    offers = product_node.get("offers")
    if not offers:
        return None
    items = offers if isinstance(offers, list) else [offers]
    for offer in items:
        spec = offer.get("priceSpecification")
        if spec:
            specs = spec if isinstance(spec, list) else [spec]
            for s in specs:
                price = s.get("price")
                if price is not None:
                    try:
                        return Decimal(str(price))
                    except Exception:
                        continue
        price = offer.get("price")
        if price is not None:
            try:
                return Decimal(str(price))
            except Exception:
                continue
    return None


def parse_file(fp: Path) -> tuple[str, Decimal] | None:
    raw = fp.read_bytes()
    if not raw:
        return None
    html = raw.decode("utf-8", errors="replace")
    products: list[dict] = []
    for m in RE_JSONLD.finditer(html):
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        _walk_for_product(data, products)
    if not products:
        return None
    # En estos HTMLs cada Product tiene el mismo precio. Tomo el primero con nombre y precio.
    for prod in products:
        name = prod.get("name")
        if not name:
            continue
        price = _extract_price(prod)
        if price is None:
            continue
        return (RE_WS.sub(" ", str(name)).strip(), price)
    return None


def build_price_map(notes_dir: Path) -> dict[str, Decimal]:
    out: dict[str, Decimal] = {}
    for fp in sorted(notes_dir.glob("*.txt")):
        if fp.stat().st_size == 0:
            continue
        rec = parse_file(fp)
        if rec is None:
            continue
        title, price = rec
        # Si el mismo título aparece varias veces y tiene el mismo precio, ok.
        out.setdefault(_normalize_key(title), price)
    return out


async def main() -> int:
    price_map = build_price_map(NOTES_DIR)
    print(f"Precios canónicos (JSON-LD): {len(price_map)} productos únicos")

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

        ya_con_precio = 0
        upd_caja = 0
        upd_ind = 0
        sin_match: list[str] = []

        for p in productos:
            if p.precio_caja is not None or p.precio_individual is not None:
                ya_con_precio += 1
                continue
            price = price_map.get(_normalize_key(p.nombre))
            if price is None:
                sin_match.append(p.nombre)
                continue
            if "caja" in p.nombre.lower():
                p.precio_caja = price
                upd_caja += 1
            else:
                p.precio_individual = price
                upd_ind += 1

        await db.commit()

        print()
        print(f"Productos en BD: {len(productos)}")
        print(f"Ya tenían precio (no se tocaron): {ya_con_precio}")
        print(f"Actualizados (precio_caja):       {upd_caja}")
        print(f"Actualizados (precio_individual): {upd_ind}")
        print(f"Sin match (queda NULL):           {len(sin_match)}")
        if sin_match:
            print("\nProductos sin precio encontrado:")
            for n in sin_match:
                print(f"  - {n}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
