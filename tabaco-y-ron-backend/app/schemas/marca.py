from pydantic import BaseModel, ConfigDict, Field

from app.schemas.subcategoria import SubcategoriaRead


class MarcaBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=120)
    imagen: str | None = Field(default=None, max_length=500)


class MarcaCreate(MarcaBase):
    pass


class MarcaUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=120)
    imagen: str | None = Field(default=None, max_length=500)


class MarcaRead(MarcaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    subcategorias: list[SubcategoriaRead] = []
    total_productos: int = 0
