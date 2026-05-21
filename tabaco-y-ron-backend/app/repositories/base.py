from collections.abc import Sequence
from typing import Any, ClassVar, Generic, TypeVar

from sqlalchemy import Select, delete, exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """DAO genérico. Cada repo concreto fija `model` y añade queries propias.

    Reglas:
    - Toda condición se traduce a SQL (WHERE/ORDER BY/LIMIT/OFFSET).
    - Nunca se materializa la tabla para filtrar en Python.
    - El commit pertenece al repo; el router solo orquesta.
    """

    model: ClassVar[type[Base]]

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _select(self) -> Select[tuple[ModelT]]:
        return select(self.model)  # type: ignore[arg-type]

    async def get(self, id_: Any) -> ModelT | None:
        return await self.session.get(self.model, id_)  # type: ignore[return-value]

    async def exists_by(self, column: InstrumentedAttribute[Any], value: Any) -> bool:
        stmt = select(exists().where(column == value))
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model)
        result = await self.session.execute(stmt)
        return int(result.scalar_one())

    async def list_all(
        self,
        *,
        order_by: InstrumentedAttribute[Any] | None = None,
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[ModelT]:
        stmt = self._select()
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def add_all(self, entities: Sequence[ModelT]) -> Sequence[ModelT]:
        self.session.add_all(list(entities))
        await self.session.flush()
        return entities

    async def delete(self, entity: ModelT) -> None:
        await self.session.delete(entity)
        await self.session.flush()

    async def delete_by_id(self, id_: Any) -> bool:
        stmt = delete(self.model).where(self.model.id == id_)  # type: ignore[attr-defined]
        result = await self.session.execute(stmt)
        await self.session.flush()
        return (result.rowcount or 0) > 0

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()

    async def refresh(self, entity: ModelT) -> None:
        await self.session.refresh(entity)
