"""Quita el fondo de las imágenes en UPLOAD_DIR y las deja con transparencia.

Procesa una por una cada PNG/JPG en app/static/uploads (excepto las que ya
estén en la carpeta de respaldo). Antes de sobrescribir, copia el original a
`_originales_backup/`. El resultado se guarda con el MISMO nombre para no romper
las URLs referenciadas en la BD (productos.imagen).

Usa rembg (modelo u2net). La primera ejecución puede descargar el modelo.

Uso:
    python -m scripts.quitar_fondo_uploads
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image
from rembg import remove, new_session

UPLOAD_DIR = Path("app/static/uploads")
BACKUP_DIR = UPLOAD_DIR / "_originales_backup"
EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def main() -> int:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    imagenes = sorted(
        p
        for p in UPLOAD_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in EXTS
    )
    if not imagenes:
        print("No hay imágenes que procesar.")
        return 0

    print(f"Imágenes a procesar: {len(imagenes)}\n")
    session = new_session("u2net")

    for i, ruta in enumerate(imagenes, 1):
        print(f"[{i}/{len(imagenes)}] {ruta.name} ...", end=" ", flush=True)

        # Respaldo del original (no se sobrescribe si ya existe).
        respaldo = BACKUP_DIR / ruta.name
        if not respaldo.exists():
            shutil.copy2(ruta, respaldo)

        entrada = Image.open(respaldo).convert("RGBA")
        salida = remove(entrada, session=session)

        # Guardar siempre como PNG (soporta alfa) con el mismo nombre.
        destino = ruta.with_suffix(".png")
        salida.save(destino)
        if destino != ruta:
            ruta.unlink()  # quitar el original no-PNG
            print(f"OK -> {destino.name} (era {ruta.suffix})")
        else:
            print("OK (transparente)")

    print(f"\nListo. Originales respaldados en: {BACKUP_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
