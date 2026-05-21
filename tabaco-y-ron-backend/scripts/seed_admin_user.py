"""Crea (o actualiza) un usuario del panel de administración.

Sin este paso no hay forma de iniciar sesión en /tr-admin: no existe registro
público. Idempotente por email: si el email ya existe, actualiza nombre, rol y
—si se pasa— la contraseña.

Uso:
    python -m scripts.seed_admin_user --email admin@tabacoyron.com --password "Secreta123" --nombre "Admin" --role admin
"""

from __future__ import annotations

import argparse
import asyncio
import sys

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.user import User, UserRole


async def run(*, email: str, password: str | None, nombre: str, role: UserRole) -> int:
    async with AsyncSessionLocal() as db:
        existing = (
            await db.execute(select(User).where(User.email == email))
        ).scalar_one_or_none()

        if existing is not None:
            existing.nombre = nombre
            existing.role = role
            if password:
                existing.hashed_password = hash_password(password)
            await db.commit()
            print(f"[OK] Usuario actualizado: {email} (rol={role.value})")
            return 0

        if not password:
            print("[ABORTAR] Para crear un usuario nuevo, --password es obligatorio.", file=sys.stderr)
            return 1

        db.add(
            User(
                nombre=nombre,
                email=email,
                hashed_password=hash_password(password),
                role=role,
            )
        )
        await db.commit()
        print(f"[OK] Usuario creado: {email} (rol={role.value})")
        return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Crea o actualiza un usuario del panel.")
    ap.add_argument("--email", required=True)
    ap.add_argument("--password", help="Obligatoria al crear; opcional al actualizar.")
    ap.add_argument("--nombre", default="Administrador")
    ap.add_argument(
        "--role",
        default="admin",
        choices=[r.value for r in UserRole],
        help="admin (gestiona usuarios) o gestor (solo catálogo).",
    )
    args = ap.parse_args()
    return asyncio.run(
        run(
            email=args.email,
            password=args.password,
            nombre=args.nombre,
            role=UserRole(args.role),
        )
    )


if __name__ == "__main__":
    raise SystemExit(main())
