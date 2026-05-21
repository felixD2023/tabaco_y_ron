from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.producto import Producto


class Valoracion(Base):
    __tablename__ = "valoraciones"
    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_valoracion_rating_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    valoracion: Mapped[str] = mapped_column(Text, nullable=False)

    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    producto: Mapped["Producto"] = relationship(back_populates="valoraciones")
