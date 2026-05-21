"""Seed de subcategorías a partir de los JSON en C:/Users/Mage/Desktop/TABACO&RON/Pagina/Sublineas.

Idempotente: si una subcategoría (marca_id, nombre) ya existe se omite.
Aborta si algún JSON referencia una marca que no está en la BD (excepto los alias en NAME_ALIASES).

Uso:
    python -m scripts.seed_subcategorias
"""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.marca import Marca
from app.models.subcategoria import Subcategoria

SUBLINEAS_DIR = Path(r"C:\Users\Mage\Desktop\TABACO&RON\Pagina\Sublineas")

# Alias: nombre que viene en el JSON -> nombre real en la BD.
NAME_ALIASES: dict[str, str] = {
    "Esteban Carreras": "Esteban Carrera",
}


def load_json_files() -> list[tuple[Path, str, list[str]]]:
    """Devuelve [(path, nombre_marca_json, [nombres_sublineas])]."""
    out: list[tuple[Path, str, list[str]]] = []
    for fp in sorted(SUBLINEAS_DIR.glob("*.json")):
        data = json.loads(fp.read_text(encoding="utf-8"))
        marca = data["marca"].strip()
        nombres = [s["nombre"].strip() for s in data["sublineas"]]
        out.append((fp, marca, nombres))
    return out


async def main() -> int:
    files = load_json_files()
    if not files:
        print(f"[ABORTAR] No se encontraron JSON en {SUBLINEAS_DIR}", file=sys.stderr)
        return 2

    async with AsyncSessionLocal() as db:
        marcas_db = (await db.execute(select(Marca))).scalars().all()
        marcas_por_nombre: dict[str, Marca] = {m.nombre: m for m in marcas_db}

        # Validación previa: todas las marcas referenciadas deben existir.
        faltantes: list[tuple[Path, str]] = []
        for fp, marca_json, _ in files:
            target = NAME_ALIASES.get(marca_json, marca_json)
            if target not in marcas_por_nombre:
                faltantes.append((fp, marca_json))

        if faltantes:
            print("[ABORTAR] Marcas referenciadas que no existen en la BD:", file=sys.stderr)
            for fp, nombre in faltantes:
                print(f"  - {fp.name}: '{nombre}'", file=sys.stderr)
            return 1

        # Cargar subcategorías existentes para idempotencia.
        existentes = (await db.execute(select(Subcategoria.marca_id, Subcategoria.nombre))).all()
        ya_en_db: set[tuple[int, str]] = {(r.marca_id, r.nombre) for r in existentes}

        total_insertadas = 0
        total_omitidas = 0
        nuevas: list[Subcategoria] = []

        for fp, marca_json, nombres in files:
            target = NAME_ALIASES.get(marca_json, marca_json)
            marca = marcas_por_nombre[target]

            insertadas_aqui = 0
            omitidas_aqui = 0
            for nombre in nombres:
                if (marca.id, nombre) in ya_en_db:
                    omitidas_aqui += 1
                    continue
                nuevas.append(Subcategoria(nombre=nombre, marca_id=marca.id))
                ya_en_db.add((marca.id, nombre))
                insertadas_aqui += 1

            total_insertadas += insertadas_aqui
            total_omitidas += omitidas_aqui
            print(
                f"  {fp.name:40s} -> {marca.nombre:25s} "
                f"insertadas={insertadas_aqui:3d}  ya_existian={omitidas_aqui:3d}"
            )

        if nuevas:
            db.add_all(nuevas)
            await db.commit()

        print()
        print(f"Total insertadas: {total_insertadas}")
        print(f"Total ya existian (omitidas): {total_omitidas}")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
