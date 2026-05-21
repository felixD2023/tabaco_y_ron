from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ValoracionBase(BaseModel):
    rating: int = Field(ge=1, le=5)
    email: EmailStr
    valoracion: str = Field(min_length=1)


class ValoracionCreate(ValoracionBase):
    producto_id: int


class ValoracionRead(ValoracionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    producto_id: int
    created_at: datetime
