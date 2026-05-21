from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.producto import Fortaleza


class ProductoBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=200)
    descripcion: str | None = None

    precio_individual: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    precio_caja: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    precio_descuento_individual: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    precio_descuento_caja: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )

    fortaleza: Fortaleza | None = None

    tiempo_fumado: str | None = Field(default=None, max_length=60)

    cepo: int | None = Field(default=None, ge=0)
    largo_mm: int | None = Field(default=None, ge=0)
    vitola: str | None = Field(default=None, max_length=60)

    unidades_por_caja: int | None = Field(default=None, ge=1)

    rating: int | None = Field(default=None, ge=1, le=100)
    existencia: bool = True

    imagen: str | None = Field(default=None, max_length=500)


class ProductoImagenInput(BaseModel):
    """Imagen de la galería al crear/actualizar un producto. Sin `id`: el
    conjunto enviado reemplaza por completo la galería existente."""

    url: str | None = Field(default=None, max_length=500)
    tipo: str = Field(default="detalle", max_length=40)
    orden: int = Field(default=0, ge=0)


class ProductoCreate(ProductoBase):
    marca_id: int
    subcategoria_id: int | None = None
    imagenes: list[ProductoImagenInput] = Field(default_factory=list)

    @model_validator(mode="after")
    def _check_consistency(self) -> "ProductoCreate":
        if self.precio_individual is None and self.precio_caja is None:
            raise ValueError("Debe especificarse al menos precio_individual o precio_caja")
        if (
            self.precio_descuento_individual is not None
            and self.precio_individual is None
        ):
            raise ValueError(
                "precio_descuento_individual requiere precio_individual"
            )
        if self.precio_descuento_caja is not None and self.precio_caja is None:
            raise ValueError("precio_descuento_caja requiere precio_caja")
        return self


class ProductoUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=200)
    descripcion: str | None = None
    precio_individual: Decimal | None = Field(default=None, ge=0)
    precio_caja: Decimal | None = Field(default=None, ge=0)
    precio_descuento_individual: Decimal | None = Field(default=None, ge=0)
    precio_descuento_caja: Decimal | None = Field(default=None, ge=0)
    fortaleza: Fortaleza | None = None
    tiempo_fumado: str | None = Field(default=None, max_length=60)
    cepo: int | None = Field(default=None, ge=0)
    largo_mm: int | None = Field(default=None, ge=0)
    vitola: str | None = Field(default=None, max_length=60)
    unidades_por_caja: int | None = Field(default=None, ge=1)
    rating: int | None = Field(default=None, ge=1, le=100)
    existencia: bool | None = None
    imagen: str | None = Field(default=None, max_length=500)
    marca_id: int | None = None
    subcategoria_id: int | None = None
    # Si se incluye (aunque sea []), reemplaza por completo la galería.
    imagenes: list[ProductoImagenInput] | None = None


class ProductoImagenRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str | None = None
    tipo: str
    orden: int


class ProductoRead(ProductoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    marca_id: int
    subcategoria_id: int | None = None
    imagenes: list[ProductoImagenRead] = []


class ValoracionMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rating: int
    email: str
    valoracion: str
    created_at: datetime


class ProductoDetail(ProductoRead):
    valoraciones: list[ValoracionMini] = []


class ProductoListResponse(BaseModel):
    items: list[ProductoRead]
    total: int
    page: int
    page_size: int
    pages: int
