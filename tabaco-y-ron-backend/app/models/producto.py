import enum
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.marca import Marca
    from app.models.producto_imagen import ProductoImagen
    from app.models.subcategoria import Subcategoria
    from app.models.valoracion import Valoracion


class Fortaleza(str, enum.Enum):
    SUAVE = "suave"
    MEDIO = "medio"
    FUERTE = "fuerte"
    SUAVE_MEDIO = "suave_medio"
    MEDIO_FUERTE = "medio_fuerte"


class Producto(Base):
    __tablename__ = "productos"
    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 100", name="ck_producto_rating_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)

    precio_individual: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    precio_caja: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    precio_descuento_individual: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    precio_descuento_caja: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    fortaleza: Mapped[Fortaleza | None] = mapped_column(
        Enum(Fortaleza, name="fortaleza"), nullable=True
    )

    tiempo_fumado: Mapped[str | None] = mapped_column(String(60), nullable=True)

    cepo: Mapped[int | None] = mapped_column(Integer, nullable=True)
    largo_mm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    vitola: Mapped[str | None] = mapped_column(String(60), nullable=True)

    # Unidades que contiene una caja. Solo aplica a productos vendidos por caja.
    unidades_por_caja: Mapped[int | None] = mapped_column(Integer, nullable=True)

    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    existencia: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    imagen: Mapped[str | None] = mapped_column(String(500), nullable=True)

    marca_id: Mapped[int] = mapped_column(
        ForeignKey("marcas.id", ondelete="CASCADE"), nullable=False, index=True
    )
    subcategoria_id: Mapped[int | None] = mapped_column(
        ForeignKey("subcategorias.id", ondelete="RESTRICT"), nullable=True, index=True
    )

    marca: Mapped["Marca"] = relationship(back_populates="productos")
    subcategoria: Mapped["Subcategoria | None"] = relationship(back_populates="productos")
    valoraciones: Mapped[list["Valoracion"]] = relationship(
        back_populates="producto", cascade="all, delete-orphan", lazy="selectin"
    )
    imagenes: Mapped[list["ProductoImagen"]] = relationship(
        back_populates="producto",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="ProductoImagen.orden",
    )
