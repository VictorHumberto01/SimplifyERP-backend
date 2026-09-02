# Task 03 — CI básico

**Sprint**: sprint-00-fundacao
**Módulo(s)**: Core (infraestrutura, sem lógica de negócio)

## Objetivo

Todo push/PR nos dois repositórios roda lint, build e testes automaticamente, evitando que código quebrado chegue à branch principal.

## Backend

- [x] Workflow de CI (`.github/workflows/ci.yml`) rodando `npm run lint`, `npm run build` e `npm test` em cada PR
- [x] Serviços de Postgres/Redis disponíveis no job de CI (provisionados para futuros testes de integração — a suíte atual usa repositórios in-memory e não depende deles)

## Frontend

- [x] Workflow de CI (`.github/workflows/ci.yml`) rodando `pnpm lint` e `pnpm build` em cada PR

## Definition of Done

- [ ] PR de teste nos dois repositórios dispara o CI e reporta status (verde/vermelho) corretamente — **não verificado nesta rodada**: os workflows foram escritos e os passos que ele roda (lint/build/test) foram validados localmente com sucesso, mas não há um PR real no GitHub para confirmar a execução do Actions em si
- [ ] Falha proposital de lint/build quebra o CI como esperado — mesma ressalva acima
