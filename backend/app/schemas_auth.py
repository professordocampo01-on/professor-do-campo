from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
