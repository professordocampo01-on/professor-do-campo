# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, me, chat, routes

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

# ✅ Rota de status principal
@app.get("/")
def root():
    return {"message": "🚀 API do Professor do Campo está online!"}

# ✅ Registrar rotas da API
app.include_router(auth.router)
app.include_router(me.router)
app.include_router(chat.router)
app.include_router(routes.router)
