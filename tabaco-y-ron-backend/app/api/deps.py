from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User, UserRole
from app.repositories.marca import MarcaRepository
from app.repositories.producto import ProductoRepository
from app.repositories.subcategoria import SubcategoriaRepository
from app.repositories.user import UserRepository
from app.repositories.valoracion import ValoracionRepository

bearer_scheme = HTTPBearer(bearerFormat="JWT", auto_error=True)

DBSession = Annotated[AsyncSession, Depends(get_db)]


def get_marca_repository(db: DBSession) -> MarcaRepository:
    return MarcaRepository(db)


def get_subcategoria_repository(db: DBSession) -> SubcategoriaRepository:
    return SubcategoriaRepository(db)


def get_producto_repository(db: DBSession) -> ProductoRepository:
    return ProductoRepository(db)


def get_valoracion_repository(db: DBSession) -> ValoracionRepository:
    return ValoracionRepository(db)


def get_user_repository(db: DBSession) -> UserRepository:
    return UserRepository(db)


MarcaRepo = Annotated[MarcaRepository, Depends(get_marca_repository)]
SubcategoriaRepo = Annotated[SubcategoriaRepository, Depends(get_subcategoria_repository)]
ProductoRepo = Annotated[ProductoRepository, Depends(get_producto_repository)]
ValoracionRepo = Annotated[ValoracionRepository, Depends(get_valoracion_repository)]
UserRepo = Annotated[UserRepository, Depends(get_user_repository)]


async def get_current_user(
    user_repo: UserRepo,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (ValueError, KeyError):
        raise credentials_exc

    user = await user_repo.get(user_id)
    if user is None:
        raise credentials_exc
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*roles: UserRole):
    async def _checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta acción",
            )
        return user

    return _checker


require_admin = require_roles(UserRole.ADMIN)
require_admin_or_gestor = require_roles(UserRole.ADMIN, UserRole.GESTOR)
