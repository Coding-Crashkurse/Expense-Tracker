from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class TransactionCreate(BaseModel):
    month: str
    category: Optional[str] = None
    income: float = 0
    expense: float = 0


class TransactionOut(BaseModel):
    id: int
    month: str
    category: Optional[str] = None  # <-- Hier hinzufügen
    income: float
    expense: float

    class Config:
        orm_mode = True
