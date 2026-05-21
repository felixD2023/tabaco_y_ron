from typing import Annotated, Literal

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status

from app.api.deps import MarcaRepo, require_admin_or_gestor
from app.models.marca import Marca
from app.repositories.exceptions import AlreadyExistsError
from app.schemas.marca import MarcaCreate, MarcaRead, MarcaUpdate

router = APIRouter(prefix="/marcas", tags=["marcas"])


@router.get("", response_model=list[MarcaRead])
async def list_marcas(
    repo: MarcaRepo,
    search: Annotated[str | None, Query(max_length=120)] = None,
    order_by: Annotated[Literal["nombre", "id"], Query()] = "nombre",
    limit: Annotated[int | None, Query(ge=1, le=200)] = None,
    offset: Annotated[int | None, Query(ge=0)] = None,
) -> list[Marca]:
    items = await repo.list_filtered(
        search=search,
        order_by=order_by,
        limit=limit,
        offset=offset,
    )
    counts = await repo.producto_counts()
    for m in items:
        m.total_productos = counts.get(m.id, 0)
    return list(items)


@router.get("/{marca_id}", response_model=MarcaRead)
async def get_marca(marca_id: int, repo: MarcaRepo) -> Marca:
    marca = await repo.get(marca_id)
    if marca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca no encontrada")
    counts = await repo.producto_counts()
    marca.total_productos = counts.get(marca.id, 0)
    return marca


@router.post(
    "",
    response_model=MarcaRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def create_marca(payload: MarcaCreate, repo: MarcaRepo) -> Marca:
    try:
        return await repo.create(nombre=payload.nombre, imagen=payload.imagen)
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.post(
    "/bulk",
    response_model=list[MarcaRead],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def create_marcas_bulk(
    repo: MarcaRepo,
    payload: list[MarcaCreate] = Body(..., min_length=1),
) -> list[Marca]:
    nombres = [m.nombre for m in payload]
    duplicados_internos = {n for n in nombres if nombres.count(n) > 1}
    if duplicados_internos:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Nombres duplicados en la petición: {sorted(duplicados_internos)}",
        )

    ya_en_db = await repo.existing_nombres(nombres)
    if ya_en_db:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Ya existen marcas con estos nombres: {ya_en_db}",
        )

    nuevas = [Marca(**m.model_dump()) for m in payload]
    try:
        creadas = await repo.bulk_create(nuevas)
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc
    return list(creadas)


@router.patch(
    "/{marca_id}",
    response_model=MarcaRead,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def update_marca(marca_id: int, payload: MarcaUpdate, repo: MarcaRepo) -> Marca:
    marca = await repo.get(marca_id)
    if marca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca no encontrada")

    data = payload.model_dump(exclude_unset=True)
    try:
        return await repo.update(
            marca,
            nombre=data.get("nombre"),
            imagen=data.get("imagen"),
            imagen_set="imagen" in data,
        )
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.delete(
    "/{marca_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def delete_marca(marca_id: int, repo: MarcaRepo) -> None:
    marca = await repo.get(marca_id)
    if marca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca no encontrada")
    await repo.remove(marca)
