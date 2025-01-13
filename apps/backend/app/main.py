from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .database import SessionLocal, engine
from .models import Base, User, Transaction
from .schemas import UserCreate, UserLogin, TransactionCreate, TransactionOut
from .auth import (
    create_access_token,
    get_password_hash,
    verify_password,
    decode_token,
    oauth2_scheme,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB initialisieren
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if not db.query(User).first():
        user = User(username="testuser", password_hash=get_password_hash("testpass"))
        db.add(user)
        db.commit()
        db.refresh(user)
    db.close()


@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Falscher Username oder Passwort")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/transactions", response_model=list[TransactionOut])
def get_transactions(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    username = decode_token(token)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User nicht gefunden")

    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    return transactions


@app.post("/transactions", response_model=TransactionOut)
def create_transaction(
    transaction_data: TransactionCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    username = decode_token(token)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User nicht gefunden")

    transaction = Transaction(
        month=transaction_data.month,
        category=transaction_data.category,
        income=transaction_data.income,
        expense=transaction_data.expense,
        user_id=user.id,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
