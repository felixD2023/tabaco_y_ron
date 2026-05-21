from typing import Annotated

from fastapi import APIRouter, Form, HTTPException, status

from app.api.deps import UserRepo
from app.core.security import create_access_token, verify_password
from app.schemas.token import Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(
    repo: UserRepo,
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
) -> Token:
    user = await repo.get_by_email(username)
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(subject=user.id, extra={"role": user.role.value})
    return Token(access_token=token)
