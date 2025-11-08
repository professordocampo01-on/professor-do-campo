from sqlmodel import Session, select
from .models import User
from .utils.security import hash_password, verify_password

def create_user(session: Session, email: str, password: str, username: str = None):
    hashed = hash_password(password)
    user = User(email=email, username=username, hashed_password=hashed)
    session.add(user); session.commit(); session.refresh(user)
    return user

def authenticate_user(session: Session, email: str, password: str):
    q = session.exec(select(User).where(User.email == email))
    user = q.first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
