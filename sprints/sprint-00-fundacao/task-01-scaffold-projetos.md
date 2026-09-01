# Task 01 — Scaffold dos projetos

**Sprint**: sprint-00-fundacao
**Módulo(s)**: Core (infraestrutura, sem lógica de negócio)

## Objetivo

Ter os dois repositórios com o scaffold inicial rodando localmente (`pnpm dev` sobe algo em ambos), prontos para receber código de negócio.

## Backend

- [x] Inicializar projeto TypeScript + Fastify (`package.json`, dependências, `tsconfig.json`)
- [x] Criar estrutura de pastas por módulo (`src/modules/identity-access` já segue `domain`/`application`/`infrastructure`/`interface` na prática, via entities/use-cases/http/persistence — ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [x] Endpoint de health-check (`GET /v1/healthz`)
- [x] Lint/format (ESLint + Prettier) configurados
- [x] Scripts `dev`, `build`, `start`, `lint`, `test` no `package.json`, alinhados ao README
- [x] Corrigido bug no script `dev` (apontava para um `.env.development` inexistente; a app já carrega `.env` via `dotenv` internamente)
- [ ] Renomear/reorganizar `identity-access` para refletir os bounded contexts do domain model (`Core`, com `Tenant`/`Establishment`) — hoje o módulo só tem `User`/`Session`, sem tenant

## Frontend

- [x] `create-next-app` com TypeScript, App Router, `src/`, Tailwind CSS, ESLint, pnpm
- [x] Página inicial mínima (placeholder) e metadata da aplicação atualizados
- [x] Assets de demo do template removidos (`public/*.svg`, página padrão)

## Definition of Done

- [x] `npm run dev` sobe a API Fastify localmente e `GET /v1/healthz` responde 200
- [x] `pnpm dev` sobe o frontend Next.js localmente
- [x] Lint passa sem erros nos dois repositórios
