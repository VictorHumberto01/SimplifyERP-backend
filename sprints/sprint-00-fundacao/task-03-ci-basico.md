# Task 03 — CI básico

**Sprint**: sprint-00-fundacao
**Módulo(s)**: Core (infraestrutura, sem lógica de negócio)

## Objetivo

Todo push/PR nos dois repositórios roda lint, build e testes automaticamente, evitando que código quebrado chegue à branch principal.

## Backend

- [ ] Workflow de CI (ex. GitHub Actions) rodando `pnpm lint`, `pnpm build` e `pnpm test` em cada PR
- [ ] Serviço de Postgres/Redis disponível no job de CI para testes de integração (se necessário)

## Frontend

- [ ] Workflow de CI rodando `pnpm lint` e `pnpm build` em cada PR

## Definition of Done

- [ ] PR de teste nos dois repositórios dispara o CI e reporta status (verde/vermelho) corretamente
- [ ] Falha proposital de lint/build quebra o CI como esperado
