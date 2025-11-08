from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..schemas_auth import UserCreate, Token, UserOut
from ..crud_auth import create_user, authenticate_user
from ..utils.security import create_access_token

router = APIRouter(prefix="/api/auth")

def get_db():
    with Session(engine) as s:
        yield s

@router.post("/signup", response_model=UserOut)
def signup(payload: UserCreate, session: Session = Depends(get_db)):
    q = session.exec(select(__import__("..models", fromlist=["User"]).User).where(__import__("..models", fromlist=["User"]).User.email == payload.email))
    existing = q.first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    user = create_user(session, payload.email, payload.password, payload.username)
    return UserOut(id=user.id, email=user.email, username=user.username)

@router.post("/login", response_model=Token)
def login(payload: UserCreate, session: Session = Depends(get_db)):
    user = authenticate_user(session, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = create_access_token(subject=user.id)
    return Token(access_token=token)
