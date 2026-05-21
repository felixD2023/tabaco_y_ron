from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.producto import Producto


class ProductoImagen(Base):
    """Galería de imágenes de un producto.

    El campo `tipo` permite distinguir el rol de cada imagen:
      - 'tabaco_suelto': representa la variante individual del producto (cuando el
        producto principal es la caja, esta es la foto del cigarro suelto y su click
        en la UI alterna a `precio_individual`).
      - 'detalle': foto adicional sin semántica especial.
    """

    __tablename__ = "producto_imagenes"

    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False, index=True
    )
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tipo: Mapped[str] = mapped_column(String(40), nullable=False, default="detalle")
    orden: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    producto: Mapped["Producto"] = relationship(back_populates="imagenes")
