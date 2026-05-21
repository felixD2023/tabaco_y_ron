"""Seed de productos Rocky Patel a partir de los notes.txt (HTML de WooCommerce).

- Carpeta de notas: C:\\Users\\Mage\\Desktop\\TABACO&RON\\Pagina\\Productos X Marca\\Rocky Patel
- Marca destino: 'Rocky Patel' (debe existir en la BD).
- Subcategorías: se mapean a partir del atributo 'Lineas' del HTML; si no aparece y
  el producto es 'Tubo Sampler Premium 6 Toros', se asigna a 'Vintage Sampler Premium'.
- Idempotente: si ya hay un producto con el mismo (nombre, marca_id) se omite.
- Los dos primeros productos reciben imagen (copiada previamente a static/uploads).

Uso:
    python -m scripts.seed_productos_rocky_patel
"""

from __future__ import annotations

import asyncio
import html
import re
import sys
from decimal import Decimal
from pathlib import Path
from typing import Iterator

from sqlalchemy import select

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Fortaleza, Producto
from app.models.subcategoria import Subcategoria

NOTES_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Productos X Marca\Rocky Patel")
MARCA_NOMBRE = "Rocky Patel"

# Fallback para productos cuyo HTML no trae el atributo "Lineas".
FALLBACK_SUBCATEGORIA: dict[str, str] = {
    "ROCKY PATEL Tubo Sampler Premium 6 Toros": "Vintage Sampler Premium",
}

# Imágenes de demo para los 2 primeros productos.
IMG_PUBLIC_PATHS = [
    f"{settings.PUBLIC_BASE_URL.rstrip('/')}/static/uploads/seed-rocky-patel-decade-forty-six.png",
    f"{settings.PUBLIC_BASE_URL.rstrip('/')}/static/uploads/seed-rocky-patel-decade-forty-six-2x.png",
]


# --- Parser ------------------------------------------------------------------

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def clean_html(text: str) -> str:
    return _WS_RE.sub(" ", html.unescape(_TAG_RE.sub(" ", text))).strip()


def parse_fortaleza(text: str) -> Fortaleza | None:
    t = text.lower().replace("ó", "o").replace("í", "i").replace("á", "a")
    t = t.replace("é", "e").replace("ú", "u")
    # rangos primero (más específicos)
    if "suave a media" in t or "suave a medio" in t or "de suave a media" in t:
        return Fortaleza.SUAVE_MEDIO
    if "media a full" in t or "media a fuerte" in t or "medio a fuerte" in t:
        return Fortaleza.MEDIO_FUERTE
    if "fuerte" in t or "full" in t:
        return Fortaleza.FUERTE
    if "media" in t or "medio" in t:
        return Fortaleza.MEDIO
    if "suave" in t:
        return Fortaleza.SUAVE
    return None


def parse_dimensiones(text: str) -> tuple[int | None, int | None]:
    """Devuelve (largo_mm, cepo).

    Casos vistos:
        '152.4 mm'             -> (152, None)
        '140 x 20 mm'          -> (140, 20)
        '140 x 19.8 mm'        -> (140, 20)   (acepta decimales en cepo)
        'Cepo 50 x 140 mm'     -> (140, 50)
        'Cepo 50 x 124'        -> (124, 50)   ('mm' opcional cuando hay 'Cepo')
    """
    t = text.strip()
    num = r"\d+(?:\.\d+)?"
    # Cepo X x Y [mm]: el 'mm' es opcional porque el label 'Cepo' ya basta.
    m = re.search(rf"cepo\s*({num})\s*x\s*({num})(?:\s*mm)?\b", t, re.IGNORECASE)
    if m:
        return int(round(float(m.group(2)))), int(round(float(m.group(1))))
    m = re.search(rf"({num})\s*x\s*({num})\s*mm", t, re.IGNORECASE)
    if m:
        a = float(m.group(1))
        b = float(m.group(2))
        largo, cepo = (a, b) if a >= b else (b, a)
        return int(round(largo)), int(round(cepo))
    m = re.search(rf"({num})\s*mm", t)
    if m:
        return int(round(float(m.group(1)))), None
    return None, None


def parse_tiempo_fumada(text: str) -> tuple[int | None, int | None]:
    """Devuelve (min, max) en minutos. '45- 60 minutes' / '60 – 90 minutos'."""
    t = text.lower().replace("–", "-").replace("—", "-")
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*minut", t)
    if m:
        return int(m.group(1)), int(m.group(2))
    m = re.search(r"(\d+)\s*minut", t)
    if m:
        v = int(m.group(1))
        return v, v
    return None, None


def parse_rating(descripcion_larga: str) -> int | None:
    """Busca 'Puntuación: 95' o '95 de Cigar Aficionado'."""
    t = descripcion_larga
    m = re.search(r"Puntuaci[óo]n[:\s]*([0-9]{1,3})", t, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    m = re.search(r"\b([0-9]{2,3})\s*de\s*Cigar\s+Aficionado", t, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    return None


def parse_file(fp: Path) -> dict | None:
    raw = fp.read_bytes()
    if not raw:
        return None
    html_text = raw.decode("utf-8", errors="replace")

    m_title = re.search(
        r'<h1[^>]*class="product_title[^"]*"[^>]*>([^<]+)</h1>', html_text
    )
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
    # Texto plano del bloque (sirve para parsear los labels sin importar dónde van los tags).
    short_text = clean_html(short_block)

    # Descripción larga.
    long_block = ""
    m_long = re.search(
        r'id="tab-description"[^>]*>(.*?)</div>\s*<div class="woocommerce-Tabs-panel woocommerce-Tabs-panel--additional_information',
        html_text,
        re.DOTALL,
    )
    if m_long:
        long_block = m_long.group(1)
    descripcion = clean_html(long_block) or None

    # Linea (subcategoría).
    linea = None
    m_linea = re.search(
        r'attribute_pa_lineas[^>]*">\s*<th[^>]*>Lineas</th>\s*<td[^>]*>(.*?)</td>',
        html_text,
        re.DOTALL,
    )
    if m_linea:
        linea = clean_html(m_linea.group(1)) or None
    if not linea:
        linea = FALLBACK_SUBCATEGORIA.get(nombre)

    def _field(*labels: str) -> str | None:
        """Extrae el valor de 'Label: valor' en el texto plano de la short_description.

        El valor termina al encontrar el siguiente label conocido o el final del texto.
        """
        stop = r"(?:Fortaleza|Especificaciones|Formato|Format|Dimensiones|Dimensions|Tiempo de Fumada|Smoking Time)\s*:"
        for label in labels:
            pat = rf"{label}\s*:\s*(.+?)(?=\s*(?:{stop})|$)"
            m = re.search(pat, short_text, re.IGNORECASE)
            if m:
                val = m.group(1).strip()
                if val:
                    return val
        return None

    fortaleza_txt = _field("Fortaleza")
    fortaleza = parse_fortaleza(fortaleza_txt) if fortaleza_txt else None

    dim_txt = _field("Dimensiones", "Dimensions")
    largo_mm, cepo = parse_dimensiones(dim_txt) if dim_txt else (None, None)

    tiempo_txt = _field("Tiempo de Fumada", "Smoking Time")
    tiempo_fumado = tiempo_txt.strip() if tiempo_txt else None

    rating = parse_rating(descripcion or "")

    return {
        "nombre": nombre,
        "descripcion": descripcion,
        "linea": linea,
        "fortaleza": fortaleza,
        "largo_mm": largo_mm,
        "cepo": cepo,
        "tiempo_fumado": tiempo_fumado,
        "rating": rating,
        "_file": fp.name,
    }


# --- Seed --------------------------------------------------------------------


def iter_parsed() -> Iterator[dict]:
    for fp in sorted(NOTES_DIR.glob("*.txt"), key=lambda p: p.name):
        rec = parse_file(fp)
        if rec is not None:
            yield rec


async def main() -> int:
    parsed = list(iter_parsed())
    if not parsed:
        print(f"[ABORTAR] No se encontraron productos parseables en {NOTES_DIR}", file=sys.stderr)
        return 2

    async with AsyncSessionLocal() as db:
        marca = (
            await db.execute(select(Marca).where(Marca.nombre == MARCA_NOMBRE))
        ).scalar_one_or_none()
        if marca is None:
            print(f"[ABORTAR] No existe la marca '{MARCA_NOMBRE}' en la BD.", file=sys.stderr)
            return 1

        subs = (
            await db.execute(select(Subcategoria).where(Subcategoria.marca_id == marca.id))
        ).scalars().all()
        sub_by_nombre: dict[str, Subcategoria] = {s.nombre: s for s in subs}

        # Validación previa: las lineas referenciadas (si vienen) deben existir.
        # `linea = None` => producto sin subcategoría (queda con subcategoria_id NULL).
        lineas_invalidas: list[tuple[str, str]] = []
        for rec in parsed:
            if rec["linea"] is not None and rec["linea"] not in sub_by_nombre:
                lineas_invalidas.append((rec["_file"], rec["linea"]))
        if lineas_invalidas:
            print("[ABORTAR] Productos con linea desconocida:", file=sys.stderr)
            for f, l in lineas_invalidas:
                print(f"  - {f}: '{l}'", file=sys.stderr)
            return 1

        # Existentes para idempotencia.
        existentes_nombres = {
            r[0]
            for r in (
                await db.execute(select(Producto.nombre).where(Producto.marca_id == marca.id))
            ).all()
        }

        nuevos: list[Producto] = []
        omitidos = 0
        idx_imagen = 0

        for rec in parsed:
            if rec["nombre"] in existentes_nombres:
                omitidos += 1
                print(f"  [skip duplicado] {rec['nombre']}")
                continue

            imagen = None
            if idx_imagen < len(IMG_PUBLIC_PATHS):
                imagen = IMG_PUBLIC_PATHS[idx_imagen]
                idx_imagen += 1

            sub_id: int | None = (
                sub_by_nombre[rec["linea"]].id if rec["linea"] else None
            )
            producto = Producto(
                nombre=rec["nombre"],
                descripcion=rec["descripcion"],
                fortaleza=rec["fortaleza"],
                tiempo_fumado=rec["tiempo_fumado"],
                cepo=rec["cepo"],
                largo_mm=rec["largo_mm"],
                rating=rec["rating"],
                existencia=True,
                imagen=imagen,
                marca_id=marca.id,
                subcategoria_id=sub_id,
            )
            nuevos.append(producto)
            existentes_nombres.add(rec["nombre"])

        if nuevos:
            db.add_all(nuevos)
            await db.commit()

        print()
        print(f"Productos parseados: {len(parsed)}")
        print(f"Insertados:          {len(nuevos)}")
        print(f"Omitidos (duplicados): {omitidos}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
