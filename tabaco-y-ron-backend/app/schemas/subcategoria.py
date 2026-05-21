from pydantic import BaseModel, ConfigDict, Field


class SubcategoriaBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=120)


class SubcategoriaCreate(SubcategoriaBase):
    marca_id: int


class SubcategoriaUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=120)
    marca_id: int | None = None


class SubcategoriaRead(SubcategoriaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    marca_id: int
