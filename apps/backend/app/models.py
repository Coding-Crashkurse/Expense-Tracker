from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    category = Column(String, nullable=True)  # <-- Neu
    income = Column(Float, default=0.0)
    expense = Column(Float, default=0.0)
    user_id = Column(Integer)
