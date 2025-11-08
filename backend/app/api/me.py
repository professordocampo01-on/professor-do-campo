from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session
from ..database import engine
from ..models import User
from ..schemas_auth import UserOut
from ..utils.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db():
    with Session(engine) as session:
        yield session


@router.get("/me", response_model=UserOut)
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_db)):
    try:
        # 🔐 Decodifica o token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # 🔍 Busca o usuário no banco
        user = session.get(User, int(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        return UserOut(id=user.id, email=user.email, username=user.username)

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
