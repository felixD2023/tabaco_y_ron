from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import ValoracionRepo
from app.models.valoracion import Valoracion
from app.schemas.valoracion import ValoracionCreate, ValoracionRead

router = APIRouter(prefix="/valoraciones", tags=["valoraciones"])


@router.get("", response_model=list[ValoracionRead])
async def list_valoraciones(
    repo: ValoracionRepo,
    producto_id: Annotated[int | None, Query()] = None,
    limit: Annotated[int | None, Query(ge=1, le=200)] = None,
    offset: Annotated[int | None, Query(ge=0)] = None,
) -> list[Valoracion]:
    items = await repo.list_filtered(
        producto_id=producto_id, limit=limit, offset=offset
    )
    return list(items)


@router.post("", response_model=ValoracionRead, status_code=status.HTTP_201_CREATED)
async def create_valoracion(payload: ValoracionCreate, repo: ValoracionRepo) -> Valoracion:
    if not await repo.producto_exists(payload.producto_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    return await repo.create(
        rating=payload.rating,
        email=payload.email,
        valoracion=payload.valoracion,
        producto_id=payload.producto_id,
    )
