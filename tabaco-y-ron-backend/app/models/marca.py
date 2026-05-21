from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.producto import Producto
    from app.models.subcategoria import Subcategoria


class Marca(Base):
    __tablename__ = "marcas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    imagen: Mapped[str | None] = mapped_column(String(500), nullable=True)

    subcategorias: Mapped[list["Subcategoria"]] = relationship(
        back_populates="marca", cascade="all, delete-orphan", lazy="selectin"
    )
    productos: Mapped[list["Producto"]] = relationship(
        back_populates="marca", cascade="all, delete-orphan", lazy="selectin"
    )
