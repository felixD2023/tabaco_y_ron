from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.user import User, UserRole
from app.repositories.base import BaseRepository
from app.repositories.exceptions import AlreadyExistsError


class UserRepository(BaseRepository[User]):
    model = User

    async def list_ordered(
        self,
        *,
        limit: int | None = None,
        offset: int | None = None,
    ) -> Sequence[User]:
        stmt = select(User).order_by(User.id)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(
        self,
        *,
        nombre: str,
        email: str,
        hashed_password: str,
        role: UserRole,
    ) -> User:
        user = User(
            nombre=nombre,
            email=email,
            hashed_password=hashed_password,
            role=role,
        )
        self.session.add(user)
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("User", "email", email) from exc
        await self.session.refresh(user)
        return user

    async def update(
        self,
        user: User,
        *,
        nombre: str | None = None,
        email: str | None = None,
        hashed_password: str | None = None,
        role: UserRole | None = None,
    ) -> User:
        if nombre is not None:
            user.nombre = nombre
        if email is not None:
            user.email = email
        if hashed_password is not None:
            user.hashed_password = hashed_password
        if role is not None:
            user.role = role
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise AlreadyExistsError("User", "email", email) from exc
        await self.session.refresh(user)
        return user

    async def remove(self, user: User) -> None:
        await self.session.delete(user)
        await self.session.commit()
