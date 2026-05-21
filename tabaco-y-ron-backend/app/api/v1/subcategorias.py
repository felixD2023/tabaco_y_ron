from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import SubcategoriaRepo, require_admin_or_gestor
from app.models.subcategoria import Subcategoria
from app.repositories.exceptions import AlreadyExistsError
from app.schemas.subcategoria import SubcategoriaCreate, SubcategoriaRead, SubcategoriaUpdate

router = APIRouter(prefix="/subcategorias", tags=["subcategorias"])


@router.get("", response_model=list[SubcategoriaRead])
async def list_subcategorias(
    repo: SubcategoriaRepo,
    marca_id: Annotated[int | None, Query()] = None,
    search: Annotated[str | None, Query(max_length=120)] = None,
    limit: Annotated[int | None, Query(ge=1, le=200)] = None,
    offset: Annotated[int | None, Query(ge=0)] = None,
) -> list[Subcategoria]:
    items = await repo.list_filtered(
        marca_id=marca_id, search=search, limit=limit, offset=offset
    )
    return list(items)


@router.get("/{sub_id}", response_model=SubcategoriaRead)
async def get_subcategoria(sub_id: int, repo: SubcategoriaRepo) -> Subcategoria:
    sub = await repo.get(sub_id)
    if sub is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Subcategoría no encontrada")
    return sub


@router.post(
    "",
    response_model=SubcategoriaRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def create_subcategoria(
    payload: SubcategoriaCreate, repo: SubcategoriaRepo
) -> Subcategoria:
    if not await repo.marca_exists(payload.marca_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca no encontrada")
    try:
        return await repo.create(nombre=payload.nombre, marca_id=payload.marca_id)
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.patch(
    "/{sub_id}",
    response_model=SubcategoriaRead,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def update_subcategoria(
    sub_id: int, payload: SubcategoriaUpdate, repo: SubcategoriaRepo
) -> Subcategoria:
    sub = await repo.get(sub_id)
    if sub is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Subcategoría no encontrada")
    data = payload.model_dump(exclude_unset=True)
    new_marca_id = data.get("marca_id")
    if new_marca_id is not None and new_marca_id != sub.marca_id:
        if not await repo.marca_exists(new_marca_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca destino no encontrada")
    try:
        return await repo.update(
            sub, nombre=data.get("nombre"), marca_id=data.get("marca_id")
        )
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.delete(
    "/{sub_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def delete_subcategoria(sub_id: int, repo: SubcategoriaRepo) -> None:
    sub = await repo.get(sub_id)
    if sub is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Subcategoría no encontrada")
    await repo.remove(sub)
