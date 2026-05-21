from collections.abc import Sequence
from typing import Literal

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from app.models.marca import Marca
from app.models.producto import Producto
from app.repositories.base import BaseRepository
from app.repositories.exceptions import AlreadyExistsError

MarcaOrderBy = Literal["nombre", "id"]


class MarcaRepository(BaseRepository[Marca]):
    model = Marca

    async def list_filtered(
        self,
        *,
        search: str | None = None,
        order_by: MarcaOrderBy = "nombre",
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[Marca]:
        stmt = select(Marca)
        if search:
            stmt = stmt.where(Marca.nombre.ilike(f"%{search}%"))

        order_col = Marca.nombre if order_by == "nombre" else Marca.id
        stmt = stmt.order_by(order_col)

        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)

        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def producto_counts(self) -> dict[int, int]:
        """Devuelve {marca_id: nº de productos} agrupado en SQL."""
        stmt = select(Producto.marca_id, func.count(Producto.id)).group_by(
            Producto.marca_id
        )
        result = await self.session.execute(stmt)
        return {marca_id: count for marca_id, count in result.all()}

    async def get_by_nombre(self, nombre: str) -> Marca | None:
        result = await self.session.execute(select(Marca).where(Marca.nombre == nombre))
        return result.scalar_one_or_none()

    async def existing_nombres(self, nombres: Sequence[str]) -> list[str]:
        if not nombres:
            return []
        result = await self.session.execute(
            select(Marca.nombre).where(Marca.nombre.in_(nombres))
        )
        return [row[0] for row in result.all()]

    async def create(self, *, nombre: str, imagen: str | None = None) -> Marca:
        marca = Marca(nombre=nombre, imagen=imagen)
        self.session.add(marca)
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("Marca", "nombre", nombre) from exc
        await self.session.refresh(marca)
        return marca

    async def bulk_create(self, items: Sequence[Marca]) -> Sequence[Marca]:
        self.session.add_all(list(items))
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("Marca", "nombre", "<bulk>") from exc
        for m in items:
            await self.session.refresh(m)
        return items

    async def update(
        self,
        marca: Marca,
        *,
        nombre: str | None = None,
        imagen: str | None = None,
        imagen_set: bool = False,
    ) -> Marca:
        if nombre is not None:
            marca.nombre = nombre
        if imagen_set:
            marca.imagen = imagen
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("Marca", "nombre", nombre) from exc
        await self.session.refresh(marca)
        return marca

    async def remove(self, marca: Marca) -> None:
        await self.session.delete(marca)
        await self.session.commit()
