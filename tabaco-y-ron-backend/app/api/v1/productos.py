from decimal import Decimal
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import ProductoRepo, require_admin_or_gestor
from app.models.producto import Fortaleza, Producto
from app.repositories.producto import ProductoRepository
from app.schemas.producto import (
    ProductoCreate,
    ProductoDetail,
    ProductoListResponse,
    ProductoRead,
    ProductoUpdate,
)

router = APIRouter(prefix="/productos", tags=["productos"])


async def _ensure_marca_subcategoria(
    repo: ProductoRepository, *, marca_id: int, subcategoria_id: int
) -> None:
    if not await repo.marca_subcategoria_pair_exists(
        marca_id=marca_id, subcategoria_id=subcategoria_id
    ):
        if not await repo.marca_exists(marca_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Marca no encontrada")
        if not await repo.subcategoria_exists(subcategoria_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Subcategoría no encontrada")
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "La subcategoría no pertenece a la marca indicada",
        )


ProductoSortQuery = Literal["name", "precio_asc", "precio_desc", "rating_desc"]


@router.get("", response_model=ProductoListResponse)
async def list_productos(
    repo: ProductoRepo,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 24,
    sort: Annotated[ProductoSortQuery, Query()] = "name",
    q: Annotated[str | None, Query(max_length=200)] = None,
    marca_id: Annotated[list[int] | None, Query()] = None,
    subcategoria_id: Annotated[list[int] | None, Query()] = None,
    fortaleza: Annotated[list[Fortaleza] | None, Query()] = None,
    precio_min: Annotated[Decimal | None, Query(ge=0)] = None,
    precio_max: Annotated[Decimal | None, Query(ge=0)] = None,
    cepo_min: Annotated[int | None, Query(ge=0)] = None,
    cepo_max: Annotated[int | None, Query(ge=0)] = None,
    largo_min: Annotated[int | None, Query(ge=0)] = None,
    largo_max: Annotated[int | None, Query(ge=0)] = None,
    rating_min: Annotated[int | None, Query(ge=1, le=100)] = None,
    solo_existentes: Annotated[bool, Query()] = False,
) -> ProductoListResponse:
    items, total = await repo.catalog_search(
        page=page,
        page_size=page_size,
        sort=sort,
        q=q,
        marca_id=marca_id,
        subcategoria_id=subcategoria_id,
        fortaleza=fortaleza,
        precio_min=precio_min,
        precio_max=precio_max,
        cepo_min=cepo_min,
        cepo_max=cepo_max,
        largo_min=largo_min,
        largo_max=largo_max,
        rating_min=rating_min,
        solo_existentes=solo_existentes,
    )
    pages = (total + page_size - 1) // page_size if page_size else 0
    return ProductoListResponse(
        items=[ProductoRead.model_validate(p) for p in items],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{producto_id}", response_model=ProductoDetail)
async def get_producto(producto_id: int, repo: ProductoRepo) -> Producto:
    producto = await repo.get(producto_id)
    if producto is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    return producto


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def create_producto(payload: ProductoCreate, repo: ProductoRepo) -> Producto:
    await _ensure_marca_subcategoria(
        repo, marca_id=payload.marca_id, subcategoria_id=payload.subcategoria_id
    )
    return await repo.create(payload.model_dump())


@router.patch(
    "/{producto_id}",
    response_model=ProductoRead,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def update_producto(
    producto_id: int, payload: ProductoUpdate, repo: ProductoRepo
) -> Producto:
    producto = await repo.get(producto_id)
    if producto is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    data = payload.model_dump(exclude_unset=True)
    if "marca_id" in data or "subcategoria_id" in data:
        new_marca = data.get("marca_id", producto.marca_id)
        new_sub = data.get("subcategoria_id", producto.subcategoria_id)
        await _ensure_marca_subcategoria(
            repo, marca_id=new_marca, subcategoria_id=new_sub
        )
    return await repo.update(producto, data)


@router.delete(
    "/{producto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin_or_gestor)],
)
async def delete_producto(producto_id: int, repo: ProductoRepo) -> None:
    producto = await repo.get(producto_id)
    if producto is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    await repo.remove(producto)
