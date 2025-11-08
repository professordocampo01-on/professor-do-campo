from fastapi import FastAPI
from .database import engine
from sqlmodel import SQLModel
from .api import routes as routes_module, auth as auth_module, chat as chat_module
from .utils.ws_manager import manager
import os

app = FastAPI(title="Professor Do Campo - Backend", version="0.1")

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()
    try:
        await manager.start_redis_listener()
    except Exception:
        pass

app.include_router(routes_module.router)
app.include_router(auth_module.router)
app.include_router(chat_module.router)
