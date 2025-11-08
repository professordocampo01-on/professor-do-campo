# Configurar Neon (Postgres) e Upstash (Redis) — GUI passo a passo

Siga este guia no painel do Neon e Upstash para criar os serviços gratuitos e copie os valores
para o painel do Render (backend) e Vercel (frontend).

1) Neon: https://neon.tech → Create Project → Free Tier → Connect → copie DATABASE_URL
2) Upstash: https://upstash.com → Create Database (Redis) → copie REDIS_URL
3) No Render: configure env vars DATABASE_URL e REDIS_URL e JWT_SECRET
4) No Vercel: configure VITE_API_URL apontando para seu backend
