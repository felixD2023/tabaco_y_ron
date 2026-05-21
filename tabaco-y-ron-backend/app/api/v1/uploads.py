import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.deps import require_admin_or_gestor
from app.core.config import settings

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
EXTENSION_BY_TYPE = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post(
    "/imagen",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def upload_imagen(file: UploadFile = File(...)) -> dict[str, str]:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            f"Tipo no soportado. Permitidos: {sorted(ALLOWED_CONTENT_TYPES)}",
        )
    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Imagen demasiado grande (>5MB)")

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    extension = EXTENSION_BY_TYPE[file.content_type]
    filename = f"{secrets.token_urlsafe(16)}{extension}"
    file_path = upload_dir / filename
    file_path.write_bytes(contents)

    public_url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/static/uploads/{filename}"
    return {"filename": filename, "url": public_url}
