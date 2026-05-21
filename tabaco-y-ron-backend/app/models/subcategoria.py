from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.marca import Marca
    from app.models.producto import Producto


class Subcategoria(Base):
    __tablename__ = "subcategorias"
    __table_args__ = (
        UniqueConstraint("marca_id", "nombre", name="uq_subcategoria_marca_nombre"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    marca_id: Mapped[int] = mapped_column(
        ForeignKey("marcas.id", ondelete="CASCADE"), nullable=False, index=True
    )

    marca: Mapped["Marca"] = relationship(back_populates="subcategorias")
    productos: Mapped[list["Producto"]] = relationship(
        back_populates="subcategoria", lazy="selectin"
    )
