# Task 02 — Infraestrutura local

**Sprint**: sprint-00-fundacao
**Módulo(s)**: Core (infraestrutura, sem lógica de negócio)

## Objetivo

Qualquer pessoa consegue clonar o backend, rodar um comando e ter PostgreSQL e Redis disponíveis localmente para desenvolvimento.

## Backend

- [x] `docker-compose.yaml` com serviços `postgres`, `redis` e `minio` (portas, volumes, variáveis default) — já vinha do scaffold reciclado, validado nesta rodada
- [x] `.env.example` com `DATABASE_URL`, `PORT`, `JWT_SECRET`, `NODE_ENV` e demais variáveis (Redis usa `REDIS_HOST`/`PORT`/`PASSWORD` em vez de uma única `REDIS_URL`)
- [x] Setup de migrations com Prisma (`npm run db:migrate:dev` / `db:migrate:deploy`)
- [x] Conexão da API com Postgres e Redis validada no boot — `src/infra/http/main.ts` chama `$connect()` no Prisma e faz `ping()` num client Redis dedicado antes de subir o Fastify; falha derruba o processo (`process.exit(1)` em produção)

## Frontend

- [x] `.env.example` com `NEXT_PUBLIC_API_URL` apontando para a API local — corrigido nesta rodada (apontava para a porta do próprio frontend, `3000`, em vez da porta real do backend, `3333`)

## Definition of Done

- [x] `docker compose up -d postgres redis minio` sobe a infra pronta para uso
- [x] `npx prisma migrate dev` aplica migrations sem erro em um banco limpo
- [x] API conecta em Postgres e Redis usando as variáveis de `.env.example`; testado também o caminho negativo (Redis inacessível → processo sai com código 1)
