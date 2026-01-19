from pydantic import BaseModel, Field
from typing import Optional


class ClientBase(BaseModel):
    name: str = Field(..., example="Juan Perez")
    # Usamos `str` para el email para evitar dependencia opcional `email-validator`.
    email: str = Field(..., example="juan@example.com")
    age: Optional[int] = Field(None, ge=0, example=30)


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None


class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True
