# backend/app/main.py
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, me, chat, routes
from .database import db  # 🔹 importa o objeto de conexão do banco

app = FastAPI(
    title="Professor do Campo API",
    description="Backend principal do aplicativo Professor do Campo",
    version="1.0.0",
)

# ✅ Permitir comunicação entre mobile, web e backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, troque por o domínio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Tentativa de conexão ao banco com retries
@app.on_event("startup")
async def startup():
    max_retries = 10
    for attempt in range(max_retries):
        try:
            await db.connect()
            print("✅ Conectado ao banco de dados com sucesso!")
            break
        except Exception as e:
            print(f"⚠️ Tentativa {attempt + 1}/{max_retries} falhou: {e}")
            await asyncio.sleep(3)
    else:
        print("🚨 Não foi possível conectar ao banco de dados após várias tentativas.")
        raise e

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

# ✅ Rota de status principal
@app.get("/")
def root():
    return {"message": "🚀 API do Professor do Campo está online!"}

# ✅ Registrar rotas da API
app.include_router(auth.router)
app.include_router(me.router)
app.include_router(chat.router)
app.include_router(routes.router)
