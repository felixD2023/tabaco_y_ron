from collections.abc import Sequence

from sqlalchemy import exists, select

from app.models.producto import Producto
from app.models.valoracion import Valoracion
from app.repositories.base import BaseRepository


class ValoracionRepository(BaseRepository[Valoracion]):
    model = Valoracion

    async def list_filtered(
        self,
        *,
        producto_id: int | None = None,
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[Valoracion]:
        stmt = select(Valoracion).order_by(Valoracion.created_at.desc())
        if producto_id is not None:
            stmt = stmt.where(Valoracion.producto_id == producto_id)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def producto_exists(self, producto_id: int) -> bool:
        stmt = select(exists().where(Producto.id == producto_id))
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def create(
        self, *, rating: int, email: str, valoracion: str, producto_id: int
    ) -> Valoracion:
        val = Valoracion(
            rating=rating,
            email=email,
            valoracion=valoracion,
            producto_id=producto_id,
        )
        self.session.add(val)
        await self.session.commit()
        await self.session.refresh(val)
        return val
