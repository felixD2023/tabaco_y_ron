from collections.abc import Mapping, Sequence
from decimal import Decimal
from typing import Any, Literal

from sqlalchemy import and_, case, exists, func, select

from app.models.marca import Marca
from app.models.producto import Fortaleza, Producto
from app.models.producto_imagen import ProductoImagen
from app.models.subcategoria import Subcategoria
from app.repositories.base import BaseRepository

ProductoOrderBy = Literal["nombre", "id", "rating"]
ProductoSort = Literal["name", "precio_asc", "precio_desc", "rating_desc"]


class ProductoRepository(BaseRepository[Producto]):
    model = Producto

    async def list_filtered(
        self,
        *,
        marca_id: int | None = None,
        subcategoria_id: int | None = None,
        solo_existentes: bool = False,
        search: str | None = None,
        order_by: ProductoOrderBy = "nombre",
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[Producto]:
        stmt = select(Producto)
        if marca_id is not None:
            stmt = stmt.where(Producto.marca_id == marca_id)
        if subcategoria_id is not None:
            stmt = stmt.where(Producto.subcategoria_id == subcategoria_id)
        if solo_existentes:
            stmt = stmt.where(Producto.existencia.is_(True))
        if search:
            stmt = stmt.where(Producto.nombre.ilike(f"%{search}%"))

        order_col = {
            "nombre": Producto.nombre,
            "id": Producto.id,
            "rating": Producto.rating.desc(),
        }[order_by]
        stmt = stmt.order_by(order_col)

        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    def _catalog_filters(
        self,
        *,
        q: str | None,
        marca_id: Sequence[int] | None,
        subcategoria_id: Sequence[int] | None,
        fortaleza: Sequence[Fortaleza] | None,
        precio_min: Decimal | None,
        precio_max: Decimal | None,
        cepo_min: int | None,
        cepo_max: int | None,
        largo_min: int | None,
        largo_max: int | None,
        rating_min: int | None,
        solo_existentes: bool,
    ) -> list[Any]:
        # COALESCE: el "precio efectivo" del producto es su precio de caja, o
        # en su defecto el precio individual. Coherente con la regla de negocio:
        # cajas filtran por precio_caja, individuales por precio_individual.
        precio_efectivo = func.coalesce(
            Producto.precio_caja, Producto.precio_individual
        )

        filters: list[Any] = []
        if q:
            filters.append(Producto.nombre.ilike(f"%{q}%"))
        if marca_id:
            filters.append(Producto.marca_id.in_(marca_id))
        if subcategoria_id:
            filters.append(Producto.subcategoria_id.in_(subcategoria_id))
        if fortaleza:
            filters.append(Producto.fortaleza.in_(fortaleza))
        if precio_min is not None:
            filters.append(precio_efectivo >= precio_min)
        if precio_max is not None:
            filters.append(precio_efectivo <= precio_max)
        if cepo_min is not None:
            filters.append(Producto.cepo >= cepo_min)
        if cepo_max is not None:
            filters.append(Producto.cepo <= cepo_max)
        if largo_min is not None:
            filters.append(Producto.largo_mm >= largo_min)
        if largo_max is not None:
            filters.append(Producto.largo_mm <= largo_max)
        if rating_min is not None:
            filters.append(Producto.rating >= rating_min)
        if solo_existentes:
            filters.append(Producto.existencia.is_(True))
        return filters

    async def catalog_search(
        self,
        *,
        page: int,
        page_size: int,
        sort: ProductoSort = "name",
        q: str | None = None,
        marca_id: Sequence[int] | None = None,
        subcategoria_id: Sequence[int] | None = None,
        fortaleza: Sequence[Fortaleza] | None = None,
        precio_min: Decimal | None = None,
        precio_max: Decimal | None = None,
        cepo_min: int | None = None,
        cepo_max: int | None = None,
        largo_min: int | None = None,
        largo_max: int | None = None,
        rating_min: int | None = None,
        solo_existentes: bool = False,
    ) -> tuple[Sequence[Producto], int]:
        """Catálogo paginado con filtros y orden compuesto.

        Orden invariable de grupo: cajas primero (precio_caja != NULL),
        después individuales (solo precio_individual), al final los sin precio.
        Dentro de cada grupo, se aplica el `sort` recibido.
        Devuelve (items_de_la_pagina, total_sin_paginar).
        """
        filters = self._catalog_filters(
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

        base = select(Producto)
        if filters:
            base = base.where(*filters)

        total = (
            await self.session.execute(
                select(func.count()).select_from(base.subquery())
            )
        ).scalar_one()

        precio_efectivo = func.coalesce(
            Producto.precio_caja, Producto.precio_individual
        )
        grupo_precio = case(
            (Producto.precio_caja.is_not(None), 0),
            (Producto.precio_individual.is_not(None), 1),
            else_=2,
        )
        secondary = {
            "name": (Producto.nombre.asc(),),
            "precio_asc": (precio_efectivo.asc().nulls_last(),),
            "precio_desc": (precio_efectivo.desc().nulls_last(),),
            "rating_desc": (Producto.rating.desc().nulls_last(),),
        }[sort]

        stmt = (
            base.order_by(grupo_precio.asc(), *secondary, Producto.id.asc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        items = (await self.session.execute(stmt)).scalars().all()
        return list(items), int(total)

    async def marca_subcategoria_pair_exists(
        self, *, marca_id: int, subcategoria_id: int
    ) -> bool:
        """True solo si la subcategoría existe Y pertenece a esa marca."""
        stmt = select(
            exists().where(
                and_(
                    Subcategoria.id == subcategoria_id,
                    Subcategoria.marca_id == marca_id,
                )
            )
        )
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def marca_exists(self, marca_id: int) -> bool:
        stmt = select(exists().where(Marca.id == marca_id))
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def subcategoria_exists(self, subcategoria_id: int) -> bool:
        stmt = select(exists().where(Subcategoria.id == subcategoria_id))
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    @staticmethod
    def _build_imagenes(items: Sequence[Mapping[str, Any]]) -> list[ProductoImagen]:
        return [
            ProductoImagen(
                url=item.get("url"),
                tipo=item.get("tipo") or "detalle",
                orden=item.get("orden", idx),
            )
            for idx, item in enumerate(items)
        ]

    async def create(self, data: Mapping[str, Any]) -> Producto:
        payload = dict(data)
        imagenes = payload.pop("imagenes", None)
        producto = Producto(**payload)
        if imagenes:
            producto.imagenes = self._build_imagenes(imagenes)
        self.session.add(producto)
        await self.session.commit()
        await self.session.refresh(producto)
        return producto

    async def update(self, producto: Producto, data: Mapping[str, Any]) -> Producto:
        payload = dict(data)
        # `imagenes` solo está presente si el cliente lo envió explícitamente
        # (gracias a exclude_unset). Si está, reemplaza toda la galería; el
        # cascade delete-orphan elimina las imágenes huérfanas.
        replace_imagenes = "imagenes" in payload
        imagenes = payload.pop("imagenes", None)
        for field, value in payload.items():
            setattr(producto, field, value)
        if replace_imagenes:
            producto.imagenes = self._build_imagenes(imagenes or [])
        await self.session.commit()
        await self.session.refresh(producto)
        return producto

    async def remove(self, producto: Producto) -> None:
        await self.session.delete(producto)
        await self.session.commit()
