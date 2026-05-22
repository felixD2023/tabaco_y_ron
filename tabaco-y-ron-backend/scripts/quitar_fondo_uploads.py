"""Quita el fondo (rembg/u2net) de las imágenes subidas vía endpoint y las deja
con transparencia, conservando la URL siempre que es posible.

Reglas por formato:
  - .png       -> se sobrescribe como PNG con alfa (misma URL, sin tocar BD).
  - .webp      -> se sobrescribe como WEBP con alfa (misma URL, sin tocar BD).
  - .jpg/.jpeg -> JPEG no soporta transparencia: se guarda como .png y se
                  ACTUALIZA la URL en la BD (productos.imagen y
                  producto_imagenes.url) para no romper las referencias.

Antes de tocar cada archivo, el original se respalda en `_originales_backup/`.
No procesa las imágenes `seed-*` (ésas no se subieron por el endpoint).

La primera ejecución de rembg puede descargar el modelo u2net (~176 MB).

Uso (desde la raíz del backend):
    python -m scripts.quitar_fondo_uploads
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image
from rembg import new_session, remove
from sqlalchemy import create_engine, text

from app.core.config import settings

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
BACKUP_DIR = UPLOAD_DIR / "_originales_backup"
EXTS = {".png", ".jpg", ".jpeg", ".webp"}
# Formatos que conservan extensión porque admiten canal alfa.
KEEP_FORMAT = {".png": "PNG", ".webp": "WEBP"}


def es_subida_por_endpoint(p: Path) -> bool:
    """Las subidas por el endpoint tienen nombre aleatorio; las semillas no."""
    return not p.name.startswith("seed-")


def main() -> int:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    imagenes = sorted(
        p
        for p in UPLOAD_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in EXTS and es_subida_por_endpoint(p)
    )
    if not imagenes:
        print("No hay imágenes que procesar.")
        return 0

    print(f"Imágenes a procesar: {len(imagenes)}\n")
    session = new_session("u2net")
    renombrados: list[tuple[str, str]] = []  # (nombre_viejo, nombre_nuevo)

    for i, ruta in enumerate(imagenes, 1):
        print(f"[{i}/{len(imagenes)}] {ruta.name} ...", end=" ", flush=True)

        # Respaldo del original (no se sobrescribe si ya existe).
        respaldo = BACKUP_DIR / ruta.name
        if not respaldo.exists():
            shutil.copy2(ruta, respaldo)

        entrada = Image.open(respaldo).convert("RGBA")
        salida = remove(entrada, session=session)  # RGBA con transparencia

        ext = ruta.suffix.lower()
        if ext in KEEP_FORMAT:
            # png / webp: misma ruta y extensión, ahora con alfa.
            salida.save(ruta, KEEP_FORMAT[ext])
            print("OK (alfa, misma URL)")
        else:
            # jpg/jpeg: a PNG (con alfa) y se anota para actualizar la BD.
            destino = ruta.with_suffix(".png")
            salida.save(destino, "PNG")
            if destino != ruta:
                ruta.unlink()
            renombrados.append((ruta.name, destino.name))
            print(f"OK -> {destino.name} (se actualizará la BD)")

    if renombrados:
        actualizar_bd(renombrados)

    print(f"\nListo. Originales respaldados en: {BACKUP_DIR}")
    return 0


def actualizar_bd(renombrados: list[tuple[str, str]]) -> None:
    """Reemplaza el nombre viejo por el nuevo en las URLs almacenadas.

    Usa replace() sobre el nombre completo de archivo (token único + extensión),
    así no afecta a otras filas. Es idempotente.
    """
    engine = create_engine(settings.sync_database_url)
    print(f"\nActualizando {len(renombrados)} URL(s) en la BD...")
    with engine.begin() as conn:
        for viejo, nuevo in renombrados:
            r1 = conn.execute(
                text("UPDATE productos SET imagen = replace(imagen, :v, :n) "
                     "WHERE imagen LIKE :patron"),
                {"v": viejo, "n": nuevo, "patron": f"%{viejo}"},
            )
            r2 = conn.execute(
                text("UPDATE producto_imagenes SET url = replace(url, :v, :n) "
                     "WHERE url LIKE :patron"),
                {"v": viejo, "n": nuevo, "patron": f"%{viejo}"},
            )
            print(f"  {viejo} -> {nuevo}  (productos: {r1.rowcount}, imagenes: {r2.rowcount})")
    print("BD actualizada.")


if __name__ == "__main__":
    raise SystemExit(main())
