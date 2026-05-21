from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import CurrentUser, UserRepo, require_admin
from app.core.security import hash_password
from app.models.user import User
from app.repositories.exceptions import AlreadyExistsError
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> User:
    return user


@router.get("", response_model=list[UserRead], dependencies=[Depends(require_admin)])
async def list_users(
    repo: UserRepo,
    limit: Annotated[int | None, Query(ge=1, le=200)] = None,
    offset: Annotated[int | None, Query(ge=0)] = None,
) -> list[User]:
    items = await repo.list_ordered(limit=limit, offset=offset)
    return list(items)


@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_user(payload: UserCreate, repo: UserRepo) -> User:
    try:
        return await repo.create(
            nombre=payload.nombre,
            email=payload.email,
            hashed_password=hash_password(payload.password),
            role=payload.role,
        )
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.patch(
    "/{user_id}", response_model=UserRead, dependencies=[Depends(require_admin)]
)
async def update_user(user_id: int, payload: UserUpdate, repo: UserRepo) -> User:
    user = await repo.get(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
    data = payload.model_dump(exclude_unset=True)
    password = data.pop("password", None)
    hashed_password = hash_password(password) if password is not None else None
    try:
        return await repo.update(
            user,
            nombre=data.get("nombre"),
            email=data.get("email"),
            hashed_password=hashed_password,
            role=data.get("role"),
        )
    except AlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_user(user_id: int, repo: UserRepo) -> None:
    user = await repo.get(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
    await repo.remove(user)
