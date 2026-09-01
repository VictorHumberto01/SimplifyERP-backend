# Task 03 — Módulos habilitados

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

O dono do estabelecimento vê quais módulos (Cardápio Digital, PDV, ...) estão ativos para o seu negócio — a base técnica da filosofia "liga e desliga módulos conforme cresce" (ver [`../../docs/modules.md`](../../docs/modules.md)).

## Backend

- [ ] Entidade `EnabledModule` associada ao `Tenant`
- [ ] Endpoint `GET /establishment/modules`: lista módulos habilitados
- [ ] Endpoint `PATCH /establishment/modules/:module`: liga/desliga um módulo (uso interno/admin no MVP)
- [ ] Evento de domínio `ModuleEnabled`

## Frontend

- [ ] Tela de configurações do estabelecimento mostrando módulos habilitados
- [ ] Navegação da aplicação reflete apenas os módulos habilitados para o tenant logado

## Definition of Done

- [ ] Desabilitar um módulo remove seu acesso na navegação sem exigir novo deploy
- [ ] Tela de configurações reflete o estado real do banco
