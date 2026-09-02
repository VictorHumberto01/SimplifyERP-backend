# Sprint 00 — Fundação

**Objetivo**: ter os dois repositórios (`SimplifyERP-backend`, `SimplifyERP-frontend`) rodando localmente com a estrutura básica no lugar, prontos para começar a implementar módulos de negócio na [Sprint 01](../sprint-01-core).

Não entrega funcionalidade de negócio — é a base técnica.

## Tarefas

| Tarefa | Descrição | Status |
|---|---|---|
| [`task-01-scaffold-projetos`](./task-01-scaffold-projetos.md) | Scaffold inicial do backend (Fastify + TS + estrutura DDD) e do frontend (Next.js + Tailwind) | Concluída (rename `identity-access` → `core` feito) |
| [`task-02-infra-local`](./task-02-infra-local.md) | Docker Compose com PostgreSQL e Redis, variáveis de ambiente | Concluída |
| [`task-03-ci-basico`](./task-03-ci-basico.md) | Pipeline de CI (lint, build, test) para os dois repositórios | Workflows criados; execução real no GitHub não verificada |
