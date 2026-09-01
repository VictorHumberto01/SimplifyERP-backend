# Task 02 — Infraestrutura local

**Sprint**: sprint-00-fundacao
**Módulo(s)**: Core (infraestrutura, sem lógica de negócio)

## Objetivo

Qualquer pessoa consegue clonar o backend, rodar um comando e ter PostgreSQL e Redis disponíveis localmente para desenvolvimento.

## Backend

- [ ] `docker-compose.yml` com serviços `postgres` e `redis` (portas, volumes, variáveis default)
- [ ] `.env.example` com `DATABASE_URL`, `REDIS_URL`, `PORT`, `JWT_SECRET`, `NODE_ENV` (conforme README)
- [ ] Setup de migrations (ferramenta a definir — ex. Prisma, Kysely ou node-pg-migrate) e script `pnpm migrate`
- [ ] Conexão da API com Postgres e Redis validada no boot (falha rápido se não conectar)

## Frontend

- [ ] `.env.example` com `NEXT_PUBLIC_API_URL` apontando para a API local (já criado — ver `SimplifyERP-frontend/.env.example`)

## Definition of Done

- [ ] `docker compose up -d` sobe Postgres e Redis prontos para uso
- [ ] `pnpm migrate` aplica migrations sem erro em um banco limpo
- [ ] API conecta em Postgres e Redis usando as variáveis de `.env.example`
