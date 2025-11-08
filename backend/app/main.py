from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from sqlmodel import SQLModel
from .api import routes as routes_module, auth as auth_module, chat as chat_module
from .utils.ws_manager import manager
import os

app = FastAPI(title="Professor Do Campo - Backend", version="0.1")

# ✅ Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Libera acesso de qualquer origem (frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Função para criar tabelas no banco
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# ✅ Evento de inicialização
@app.on_event("startup")
async def on_startup():
    create_db_and_tables()
    try:
        await manager.start_redis_listener()
    except Exception:
        pass

# ✅ Rota raiz — health check
@app.get("/")
def root():
    return {"message": "Professor do Campo API is running ✅"}

# ✅ Inclui as rotas dos módulos existentes
app.include_router(routes_module.router)
app.include_router(auth_module.router)
app.include_router(chat_module.router)
