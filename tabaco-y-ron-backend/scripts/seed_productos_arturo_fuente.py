"""Seed de productos Arturo Fuente a partir de los notes.txt (HTML de WooCommerce).

- Carpeta de notas: C:\\Users\\Mage\\Desktop\\TABACO&RON\\Pagina\\Productos X Marca\\Arturo Fuente
- Marca destino: 'Arturo Fuente' (debe existir en la BD).
- Subcategorías: el HTML NO trae el atributo 'Lineas' (a diferencia de Rocky Patel),
  así que la subcategoría se infiere desde el nombre con `linea_desde_nombre()`. Si no
  hay patrón claro, queda con subcategoria_id NULL (campo nullable).
- Idempotente: si ya hay un producto con el mismo (nombre, marca_id) se omite.

Uso:
    python -m scripts.seed_productos_arturo_fuente
"""

from __future__ import annotations

import asyncio
import html
import re
import sys
from pathlib import Path
from typing import Iterator

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.producto import Fortaleza, Producto
from app.models.subcategoria import Subcategoria

NOTES_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Productos X Marca\Arturo Fuente")
MARCA_NOMBRE = "Arturo Fuente"

# Nombres exactos como están en la BD (con en-dash U+2013 y acute U+00B4).
SUB_ANIVERSARIO_MADURO = "Arturo Fuente – Aniversario Maduro"
SUB_CURLY_HEAD_DELUXE = "ARTURO FUENTE – Curly Head Deluxe"
SUB_GRAN_RESERVA = "ARTURO FUENTE – Gran Reserva"
SUB_ITS_A_BOY = "ARTURO FUENTE – It´s a Boy"
SUB_ITS_A_GIRL = "ARTURO FUENTE – It´s a Girl"


def linea_desde_nombre(nombre: str) -> str | None:
    """Heurística para inferir la subcategoría a partir del nombre del producto.

    El HTML de Arturo Fuente en tabacoyronpa.com no expone el atributo 'Lineas'
    (cosa que sí hace Rocky Patel), así que el match se hace por patrón en el
    nombre. Cualquier producto que no encaje queda con subcategoria_id NULL.
    """
    n = nombre.lower()
    # Quitar acentos en s' / s´ para detectar "it's a boy/girl" robustamente.
    n_norm = n.replace("´", "'").replace("’", "'")
    if "curly head deluxe" in n_norm:
        return SUB_CURLY_HEAD_DELUXE
    if "it's a boy" in n_norm:
        return SUB_ITS_A_BOY
    if "it's a girl" in n_norm:
        return SUB_ITS_A_GIRL
    # Aniversario Maduro: las dos grafías observadas son "Anniversary Maduro"
    # y la variante con typo "Anniversary Madure". El 8-5-8 Anniversary Maduro
    # también cae aquí.
    if "anniversary madur" in n_norm:
        return SUB_ANIVERSARIO_MADURO
    # Línea principal Gran Reserva: agrupa los Chateau, Corona Imperial,
    # Cuban Corona y Double Chateau, que en el catálogo de Arturo Fuente son
    # parte de la Gran Reserva.
    gran_reserva_keys = (
        "chateau",
        "corona imperial",
        "cuban corona",
        "double chateau",
    )
    if any(k in n_norm for k in gran_reserva_keys):
        return SUB_GRAN_RESERVA
    return None


# --- Parser ------------------------------------------------------------------

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def clean_html(text: str) -> str:
    return _WS_RE.sub(" ", html.unescape(_TAG_RE.sub(" ", text))).strip()


def parse_fortaleza(text: str) -> Fortaleza | None:
    t = text.lower().replace("ó", "o").replace("í", "i").replace("á", "a")
    t = t.replace("é", "e").replace("ú", "u")
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
    """Devuelve (largo_mm, cepo). Mismos casos que el parser de Rocky Patel."""
    t = text.strip()
    num = r"\d+(?:\.\d+)?"
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


def parse_rating(descripcion_larga: str) -> int | None:
    t = descripcion_larga
    m = re.search(r"Puntuaci[óo]n[:\s]*([0-9]{1,3})", t, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    m = re.search(r"\b([0-9]{2,3})\s*puntos\s+por\s+Cigar\s+Aficionado", t, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    m = re.search(r"\b([0-9]{2,3})\s*de\s*Cigar\s+Aficionado", t, re.IGNORECASE)
    if m:
        v = int(m.group(1))
        return v if 1 <= v <= 100 else None
    return None


# Cierre del bloque de descripción: en Arturo Fuente NO existe la panel
# 'additional_information' (no hay atributos extra), pero sí existe la panel
# 'reviews' justo después. Aceptamos ambos para reusar la lógica con otras marcas.
_RE_LONG = re.compile(
    r'id="tab-description"[^>]*>(.*?)</div>\s*<div class="woocommerce-Tabs-panel '
    r'woocommerce-Tabs-panel--(?:additional_information|reviews)',
    re.DOTALL,
)


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
    short_text = clean_html(short_block)

    long_block = ""
    m_long = _RE_LONG.search(html_text)
    if m_long:
        long_block = m_long.group(1)
    descripcion = clean_html(long_block) or None

    # La línea (subcategoría) se infiere por el nombre.
    linea = linea_desde_nombre(nombre)

    def _field(*labels: str) -> str | None:
        stop = (
            r"(?:Fortaleza|Especificaciones|Formato|Format|Dimensiones|Dimensions|"
            r"Tiempo de Fumada|Smoking Time)\s*:"
        )
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
    tiempo_fumado = tiempo_txt.strip()[:60] if tiempo_txt else None

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

        # Validación previa: las lineas inferidas deben existir como subcategorías.
        lineas_invalidas: list[tuple[str, str]] = []
        for rec in parsed:
            if rec["linea"] is not None and rec["linea"] not in sub_by_nombre:
                lineas_invalidas.append((rec["_file"], rec["linea"]))
        if lineas_invalidas:
            print("[ABORTAR] Productos con linea desconocida:", file=sys.stderr)
            for f, l in lineas_invalidas:
                print(f"  - {f}: '{l}'", file=sys.stderr)
            return 1

        existentes_nombres = {
            r[0]
            for r in (
                await db.execute(select(Producto.nombre).where(Producto.marca_id == marca.id))
            ).all()
        }

        nuevos: list[Producto] = []
        omitidos = 0
        sin_subcategoria: list[str] = []

        for rec in parsed:
            if rec["nombre"] in existentes_nombres:
                omitidos += 1
                print(f"  [skip duplicado] {rec['nombre']}")
                continue

            sub_id: int | None = (
                sub_by_nombre[rec["linea"]].id if rec["linea"] else None
            )
            if sub_id is None:
                sin_subcategoria.append(rec["nombre"])

            producto = Producto(
                nombre=rec["nombre"],
                descripcion=rec["descripcion"],
                fortaleza=rec["fortaleza"],
                tiempo_fumado=rec["tiempo_fumado"],
                cepo=rec["cepo"],
                largo_mm=rec["largo_mm"],
                rating=rec["rating"],
                existencia=True,
                marca_id=marca.id,
                subcategoria_id=sub_id,
            )
            nuevos.append(producto)
            existentes_nombres.add(rec["nombre"])

        if nuevos:
            db.add_all(nuevos)
            await db.commit()

        print()
        print(f"Productos parseados:    {len(parsed)}")
        print(f"Insertados:             {len(nuevos)}")
        print(f"Omitidos (duplicados):  {omitidos}")
        print(f"Sin subcategoria (NULL): {len(sin_subcategoria)}")
        if sin_subcategoria:
            for n in sin_subcategoria:
                print(f"  - {n}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
