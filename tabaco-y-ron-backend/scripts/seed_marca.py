"""Pipeline completo de importación de productos de una marca desde notes.txt (HTML WooCommerce).

Consolida toda la lógica desarrollada para Rocky Patel:
  - Parseo de atributos: nombre, descripción, fortaleza, largo_mm, cepo, vitola,
    tiempo_fumado (acepta 'Tiempo de Fumada' y 'Fumado'), linea, rating.
  - Precio canónico desde el JSON-LD del propio producto (UnitPriceSpecification / offers.price).
  - Regla de precio: si el nombre trae 'caja' -> precio_caja; si no -> precio_individual.
  - Inserción idempotente (omite por nombre ya existente); subcategoria_id NULL si no hay linea.
  - Subcategorías faltantes se crean automáticamente (se reporta).
  - Merge de pares 'caja' + 'individual' (mismo cigarro, dos presentaciones): el caja se queda
    como principal con ambos precios y el individual se vuelve imagen tipo 'tabaco_suelto'.

Uso:
    python -m scripts.seed_marca --marca "AJ Fernandez" --dir "C:\\...\\AJ Fernandez" [--dry-run]
"""

from __future__ import annotations

import argparse
import asyncio
import html
import json
import re
import sys
import unicodedata
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Fortaleza, Producto
from app.models.producto_imagen import ProductoImagen
from app.models.subcategoria import Subcategoria

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")
RE_JSONLD = re.compile(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.DOTALL)


# --- helpers de texto --------------------------------------------------------


def clean_html(text: str) -> str:
    return _WS_RE.sub(" ", html.unescape(_TAG_RE.sub(" ", text))).strip()


def normalize_key(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"\bunid(ad)?\.?\b", "und", s)
    s = re.sub(r"\bund\.?\b", "und", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return _WS_RE.sub(" ", s).strip()


def normalize_base(name: str) -> str:
    """Nombre base sin el sufijo 'Caja de N und/unid' (para detectar pares)."""
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"\s*-?\s*caja\s+(de\s+)?\d+\s*(und|unid|unidades)\.?\s*$", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return _WS_RE.sub(" ", s).strip()


# --- parsers de atributos ----------------------------------------------------


def parse_fortaleza(text: str) -> Fortaleza | None:
    t = text.lower().replace("ó", "o").replace("í", "i").replace("á", "a")
    t = t.replace("é", "e").replace("ú", "u")
    # Rangos primero (más específicos). ES + EN.
    if (
        "suave a media" in t
        or "suave a medio" in t
        or "de suave a media" in t
        or "mild to medium" in t
    ):
        return Fortaleza.SUAVE_MEDIO
    if (
        "media a full" in t
        or "media a fuerte" in t
        or "medio a fuerte" in t
        or "medium to full" in t
        or "medium to strong" in t
    ):
        return Fortaleza.MEDIO_FUERTE
    if "fuerte" in t or "full" in t or "strong" in t:
        return Fortaleza.FUERTE
    if "media" in t or "medio" in t or "medium" in t:
        return Fortaleza.MEDIO
    if "suave" in t or "mild" in t:
        return Fortaleza.SUAVE
    return None


def parse_dimensiones(text: str) -> tuple[int | None, int | None]:
    """Devuelve (largo_mm, cepo). El número más pequeño es el cepo.

    Casos:
        '152.4 mm'              -> (152, None)
        '140 x 20 mm'           -> (140, 20)
        '124 mm x 19.8mm'       -> (124, 20)   (ambos números con 'mm')
        'Cepo 50 x 124'         -> (124, 50)   ('mm' opcional con 'Cepo')
        'Ring Gauge 52 x 152 mm'-> (152, 52)
    """
    t = text.strip()
    num = r"\d+(?:\.\d+)?"
    # Cepo/Ring Gauge X x Y [mm]: el primer número es el cepo.
    m = re.search(rf"(?:cepo|ring\s*gauge)\s*({num})\s*x\s*({num})(?:\s*mm)?\b", t, re.IGNORECASE)
    if m:
        return int(round(float(m.group(2)))), int(round(float(m.group(1))))
    # 'X [mm] x Y mm' (el mm tras el primer número es opcional).
    m = re.search(rf"({num})\s*(?:mm)?\s*x\s*({num})\s*mm", t, re.IGNORECASE)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        largo, cepo = (a, b) if a >= b else (b, a)
        return int(round(largo)), int(round(cepo))
    m = re.search(rf"({num})\s*mm", t)
    if m:
        return int(round(float(m.group(1)))), None
    return None, None


def parse_rating(descripcion_larga: str) -> int | None:
    m = re.search(r"Puntuaci[óo]n[:\s]*([0-9]{1,3})", descripcion_larga, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    m = re.search(r"\b([0-9]{2,3})\s*de\s*Cigar\s+Aficionado", descripcion_larga, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    return None


# --- JSON-LD precio ----------------------------------------------------------


def _walk_for_product(node, out: list[dict]) -> None:
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


def extract_price_from_html(html_text: str) -> Decimal | None:
    products: list[dict] = []
    for m in RE_JSONLD.finditer(html_text):
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        _walk_for_product(data, products)
    for prod in products:
        price = _extract_price(prod)
        if price is not None:
            return price
    return None


# --- parseo de un archivo ----------------------------------------------------


def parse_file(fp: Path) -> dict | None:
    raw = fp.read_bytes()
    if not raw:
        return None
    html_text = raw.decode("utf-8", errors="replace")

    m_title = re.search(r'<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)</h1>', html_text)
    if not m_title:
        return None
    nombre = clean_html(m_title.group(1))

    short_block = ""
    m_short = re.search(
        r'<div class="woocommerce-product-details__short-description">(.*?)</div>',
        html_text,
        re.DOTALL,
    )
    if m_short:
        short_block = m_short.group(1)
    short_text = clean_html(short_block)

    long_block = ""
    m_long = re.search(
        r'id="tab-description"[^>]*>(.*?)</div>\s*<div class="woocommerce-Tabs-panel woocommerce-Tabs-panel--additional_information',
        html_text,
        re.DOTALL,
    )
    if m_long:
        long_block = m_long.group(1)
    descripcion = clean_html(long_block) or None

    linea = None
    m_linea = re.search(
        r'attribute_pa_lineas[^>]*">\s*<th[^>]*>Lineas</th>\s*<td[^>]*>(.*?)</td>',
        html_text,
        re.DOTALL,
    )
    if m_linea:
        linea = clean_html(m_linea.group(1)) or None

    def _field(*labels: str) -> str | None:
        stop = (
            r"(?:Fortaleza|Strength|Especificaciones|Specifications|Formato|Format|"
            r"Dimensiones|Dimensions|Tiempo de Fumad[ao]|Smoking Time|Enjoy Time)\s*:"
        )
        for label in labels:
            pat = rf"{label}\s*:\s*(.+?)(?=\s*(?:{stop})|$)"
            m = re.search(pat, short_text, re.IGNORECASE)
            if m:
                val = m.group(1).strip(" -–—,;.")
                if val:
                    return val
        return None

    fortaleza_txt = _field("Fortaleza", "Strength")
    fortaleza = parse_fortaleza(fortaleza_txt) if fortaleza_txt else None

    vitola_txt = _field("Formato", "Format")
    vitola = vitola_txt[:60] if vitola_txt else None

    dim_txt = _field("Dimensiones", "Dimensions")
    largo_mm, cepo = parse_dimensiones(dim_txt) if dim_txt else (None, None)

    tiempo_txt = _field(r"Tiempo de Fumad[ao]", "Smoking Time", "Enjoy Time")
    tiempo_fumado = tiempo_txt[:60] if tiempo_txt else None

    rating = parse_rating(descripcion or "")
    precio = extract_price_from_html(html_text)

    return {
        "nombre": nombre,
        "descripcion": descripcion,
        "linea": linea,
        "fortaleza": fortaleza,
        "largo_mm": largo_mm,
        "cepo": cepo,
        "vitola": vitola,
        "tiempo_fumado": tiempo_fumado,
        "rating": rating,
        "precio": precio,
        "_file": fp.name,
    }


# --- pipeline ----------------------------------------------------------------


def iter_parsed(notes_dir: Path) -> list[dict]:
    out = []
    for fp in sorted(notes_dir.glob("*.txt"), key=lambda p: p.name):
        rec = parse_file(fp)
        if rec is not None:
            out.append(rec)
    return out


async def refresh_attrs(marca_nombre: str, notes_dir: Path) -> int:
    """Rellena atributos NULL (descripcion, fortaleza, vitola, largo, cepo, tiempo_fumado,
    rating) de productos ya existentes, re-parseando el HTML. No inserta ni borra ni toca
    precios. Útil tras corregir el parser."""
    parsed = iter_parsed(notes_dir)
    by_key: dict[str, dict] = {}
    for rec in parsed:
        by_key.setdefault(normalize_key(rec["nombre"]), rec)
        # También mapeamos la versión base (sin 'caja') para alcanzar productos mergeados.
        by_key.setdefault(normalize_base(rec["nombre"]), rec)

    async with AsyncSessionLocal() as db:
        marca = (
            await db.execute(select(Marca).where(Marca.nombre == marca_nombre))
        ).scalar_one_or_none()
        if marca is None:
            print(f"[ABORTAR] No existe la marca '{marca_nombre}'", file=sys.stderr)
            return 1
        productos = list(
            (await db.execute(select(Producto).where(Producto.marca_id == marca.id)))
            .scalars()
            .all()
        )
        campos = ("descripcion", "fortaleza", "vitola", "largo_mm", "cepo", "tiempo_fumado", "rating")
        cambios = 0
        for p in productos:
            rec = by_key.get(normalize_key(p.nombre)) or by_key.get(normalize_base(p.nombre))
            if not rec:
                continue
            tocado = False
            for campo in campos:
                if getattr(p, campo) is None and rec.get(campo) is not None:
                    setattr(p, campo, rec[campo])
                    tocado = True
            if tocado:
                cambios += 1
                print(f"  [refresh] {p.nombre[:60]}")
        await db.commit()
        print(f"\nProductos con atributos rellenados: {cambios}")
        return 0


async def run(marca_nombre: str, notes_dir: Path, dry_run: bool) -> int:
    parsed = iter_parsed(notes_dir)
    if not parsed:
        print(f"[ABORTAR] No hay productos parseables en {notes_dir}", file=sys.stderr)
        return 2

    async with AsyncSessionLocal() as db:
        marca = (
            await db.execute(select(Marca).where(Marca.nombre == marca_nombre))
        ).scalar_one_or_none()
        if marca is None:
            print(f"[ABORTAR] No existe la marca '{marca_nombre}' en la BD.", file=sys.stderr)
            return 1

        subs = list(
            (await db.execute(select(Subcategoria).where(Subcategoria.marca_id == marca.id)))
            .scalars()
            .all()
        )
        sub_by_nombre: dict[str, Subcategoria] = {s.nombre: s for s in subs}
        existentes_nombres = {
            r[0]
            for r in (
                await db.execute(select(Producto.nombre).where(Producto.marca_id == marca.id))
            ).all()
        }

        # Subcategorías referenciadas que aún no existen.
        lineas_nuevas = sorted(
            {
                rec["linea"]
                for rec in parsed
                if rec["linea"] and rec["linea"] not in sub_by_nombre
            }
        )

        print(f"=== {marca_nombre} ===")
        print(f"Archivos parseados: {len(parsed)}")
        print(f"Subcategorías nuevas a crear: {len(lineas_nuevas)}")
        for ln in lineas_nuevas:
            print(f"  + {ln}")

        # Resumen de inserciones / duplicados.
        # Dedup por (nombre, precio): si el mismo producto al mismo precio aparece en
        # varios .txt es un duplicado de scraping -> insertamos uno solo. Si el mismo
        # nombre aparece con precios distintos (caja vs individual), conservamos ambos
        # para que el merge los empareje después.
        nuevos = []
        seen_np: set[tuple[str, str]] = set()
        dups = []
        for r in parsed:
            if r["nombre"] in existentes_nombres:
                dups.append(r)
                continue
            np_key = (normalize_key(r["nombre"]), str(r["precio"]))
            if np_key in seen_np:
                continue  # duplicado exacto (mismo nombre y precio)
            seen_np.add(np_key)
            nuevos.append(r)
        print(f"\nNuevos a insertar: {len(nuevos)}")
        for r in nuevos:
            tag = "CAJA" if "caja" in r["nombre"].lower() else "IND "
            precio = f"${r['precio']}" if r["precio"] is not None else "sin precio"
            print(f"  + [{tag}] {r['nombre'][:60]:60s} | linea={r['linea']} | {precio}")
        if dups:
            print(f"\nDuplicados (ya en BD, se saltan): {len(dups)}")

        if dry_run:
            print("\n[DRY-RUN] No se escribió nada.")
            return 0

        # 1. Crear subcategorías faltantes
        for ln in lineas_nuevas:
            s = Subcategoria(nombre=ln, marca_id=marca.id)
            db.add(s)
            await db.flush()
            sub_by_nombre[ln] = s

        # 2. Insertar productos nuevos con todos los atributos + precio
        insertados = 0
        for rec in nuevos:
            sub_id = sub_by_nombre[rec["linea"]].id if rec["linea"] else None
            precio = rec["precio"]
            precio_caja = precio if (precio is not None and "caja" in rec["nombre"].lower()) else None
            precio_ind = precio if (precio is not None and "caja" not in rec["nombre"].lower()) else None
            db.add(
                Producto(
                    nombre=rec["nombre"],
                    descripcion=rec["descripcion"],
                    fortaleza=rec["fortaleza"],
                    tiempo_fumado=rec["tiempo_fumado"],
                    cepo=rec["cepo"],
                    largo_mm=rec["largo_mm"],
                    vitola=rec["vitola"],
                    rating=rec["rating"],
                    precio_caja=precio_caja,
                    precio_individual=precio_ind,
                    existencia=True,
                    imagen=None,
                    marca_id=marca.id,
                    subcategoria_id=sub_id,
                )
            )
            insertados += 1
        await db.commit()
        print(f"\nInsertados: {insertados}")

        # 3. Merge de pares caja + individual
        productos = list(
            (
                await db.execute(
                    select(Producto).where(Producto.marca_id == marca.id).order_by(Producto.nombre)
                )
            )
            .scalars()
            .all()
        )
        groups: dict[str, list[Producto]] = {}
        for p in productos:
            groups.setdefault(normalize_base(p.nombre), []).append(p)

        def eff_price(p: Producto) -> Decimal:
            return p.precio_caja or p.precio_individual or Decimal(0)

        merged = 0
        for base, items in groups.items():
            if len(items) < 2:
                continue
            con_caja = [p for p in items if "caja" in p.nombre.lower()]
            sin_caja = [p for p in items if "caja" not in p.nombre.lower()]

            if con_caja:
                # Caso 1: uno trae 'caja' en el nombre -> ese es la caja.
                caja = con_caja[0]
                if not sin_caja:
                    continue
                ind = min(sin_caja, key=eff_price)
            else:
                # Caso 2: ninguno dice 'caja'. Mismo nombre base -> el de precio
                # más alto es la caja, el más barato es el tabaco suelto. Solo si el
                # precio alto es claramente >= 2x el bajo (una caja cuesta mucho más que
                # una pieza). Si los precios son similares, no es un par: dejamos separados.
                ordered = sorted(items, key=eff_price)
                ind, caja = ordered[0], ordered[-1]
                if caja is ind:
                    continue
                lo, hi = eff_price(ind), eff_price(caja)
                if lo <= 0 or hi < 2 * lo:
                    continue
                # La caja se cargó como individual (su nombre no decía 'caja'); muevo el precio.
                if caja.precio_caja is None and caja.precio_individual is not None:
                    caja.precio_caja = caja.precio_individual
                    caja.precio_individual = None

            if caja is ind or caja.precio_individual is not None:
                continue  # ya mergeado o sin par válido
            caja.precio_individual = ind.precio_individual
            caja.precio_descuento_individual = ind.precio_descuento_individual
            db.add(
                ProductoImagen(
                    producto_id=caja.id, url=ind.imagen, tipo="tabaco_suelto", orden=1
                )
            )
            await db.delete(ind)
            merged += 1
            print(
                f"  [merge] {caja.nombre[:55]} "
                f"(caja ${caja.precio_caja} / individual ${caja.precio_individual})"
            )
        await db.commit()
        print(f"\nMergeados (caja+individual): {merged}")

        total = len(
            (
                await db.execute(select(Producto.id).where(Producto.marca_id == marca.id))
            ).all()
        )
        print(f"Total productos {marca_nombre} en BD: {total}")
        return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--marca", required=True)
    ap.add_argument("--dir", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--refresh",
        action="store_true",
        help="Solo rellena atributos NULL de productos existentes (no inserta ni mergea).",
    )
    args = ap.parse_args()
    if args.refresh:
        return asyncio.run(refresh_attrs(args.marca, Path(args.dir)))
    return asyncio.run(run(args.marca, Path(args.dir), args.dry_run))


if __name__ == "__main__":
    raise SystemExit(main())
