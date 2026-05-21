from collections.abc import Sequence

from sqlalchemy import exists, select
from sqlalchemy.exc import IntegrityError

from app.models.marca import Marca
from app.models.subcategoria import Subcategoria
from app.repositories.base import BaseRepository
from app.repositories.exceptions import AlreadyExistsError


class SubcategoriaRepository(BaseRepository[Subcategoria]):
    model = Subcategoria

    async def list_filtered(
        self,
        *,
        marca_id: int | None = None,
        search: str | None = None,
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[Subcategoria]:
        stmt = select(Subcategoria)
        if marca_id is not None:
            stmt = stmt.where(Subcategoria.marca_id == marca_id)
        if search:
            stmt = stmt.where(Subcategoria.nombre.ilike(f"%{search}%"))
        stmt = stmt.order_by(Subcategoria.nombre)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def marca_exists(self, marca_id: int) -> bool:
        stmt = select(exists().where(Marca.id == marca_id))
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def create(self, *, nombre: str, marca_id: int) -> Subcategoria:
        sub = Subcategoria(nombre=nombre, marca_id=marca_id)
        self.session.add(sub)
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("Subcategoria", "nombre+marca", (nombre, marca_id)) from exc
        await self.session.refresh(sub)
        return sub

    async def update(
        self,
        sub: Subcategoria,
        *,
        nombre: str | None = None,
        marca_id: int | None = None,
    ) -> Subcategoria:
        if nombre is not None:
            sub.nombre = nombre
        if marca_id is not None:
            sub.marca_id = marca_id
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError(
                "Subcategoria", "nombre+marca", (sub.nombre, sub.marca_id)
            ) from exc
        await self.session.refresh(sub)
        return sub

    async def remove(self, sub: Subcategoria) -> None:
        await self.session.delete(sub)
        await self.session.commit()
