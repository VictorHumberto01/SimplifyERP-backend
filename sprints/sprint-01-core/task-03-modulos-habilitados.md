# Task 03 — Módulos habilitados

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

O dono do estabelecimento vê quais módulos (Cardápio Digital, PDV, ...) estão ativos para o seu negócio — a base técnica da filosofia "liga e desliga módulos conforme cresce" (ver [`../../docs/modules.md`](../../docs/modules.md)).

## Backend

- [x] Entidade `EnabledModule` associada ao `Tenant` (enum Prisma `ModuleKey`: CORE, DIGITAL_MENU, POS, INVENTORY, FINANCE, FISCAL_REPORTS)
- [x] Endpoint `GET /v1/establishment/modules`: lista os 5 módulos toggleáveis (CORE fica de fora, é implícito) com `enabled: true/false`
- [x] Endpoint `PATCH /v1/establishment/modules/:module`: liga/desliga um módulo; rejeita tentativa de alterar `CORE`; sem checagem de role dono/operador nesta rodada (qualquer usuário do tenant pode alternar — o próprio DoD da task permite "uso interno/admin" no MVP)
- [x] Evento de domínio `ModuleEnabled` (carrega `{ tenantId, module, enabled }`, cobre habilitar e desabilitar)
- [x] `DIGITAL_MENU` e `POS` são habilitados automaticamente no signup (escopo do MVP); `INVENTORY`/`FINANCE`/`FISCAL_REPORTS` começam desligados

## Frontend

- [x] Tela `/dashboard/modulos` mostrando os módulos habilitados/desabilitados com toggle
- [x] Navegação do dashboard reflete apenas os módulos habilitados para o tenant logado (lida a partir do backend no layout, Server Component)

## Definition of Done

- [x] Desabilitar/habilitar um módulo reflete imediatamente na tela (sem novo deploy) — validado via Playwright, incluindo persistência após reload da página
- [x] Tela de configurações reflete o estado real do banco

## Corte de escopo

- Multi-estabelecimento: o schema já suporta N estabelecimentos por tenant, mas o signup cria só 1.
