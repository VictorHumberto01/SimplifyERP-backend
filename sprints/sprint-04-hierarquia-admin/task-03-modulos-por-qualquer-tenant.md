# Task 03 — Gerenciar módulos de qualquer tenant

**Sprint**: sprint-04-hierarquia-admin
**Módulo(s)**: Core

## Objetivo

Hoje `GET/PATCH /v1/establishment/modules` (ver [`sprint-01-core/task-03-modulos-habilitados`](../sprint-01-core/task-03-modulos-habilitados.md)) só funciona pro dono/operador do próprio tenant — resolve o `tenantId` a partir de `req.account.tenantId`. Contas de staff (`consultant`/`manager`/`super_admin`) não têm tenant próprio, mas precisam ligar/desligar módulos de **qualquer** tenant que estejam atendendo.

## Backend

- [ ] `ModuleController` (`requireTenantId`, hoje em `src/modules/core/http/controllers/module-controller.ts`): se `req.account.tenantId` existir, usa esse (comportamento atual, dono/operador gerenciando o próprio tenant); senão, exige um `tenantId` explícito (querystring em `GET`, body em `PATCH`) — só aceito se `req.account.role` for `consultant`, `manager` ou `super_admin`
- [ ] Validar que o `tenantId` informado existe (`ITenantRepository.getById`), senão `ResourceNotFoundError`
- [ ] Testes: consultant informando `tenantId` de um tenant existente → funciona; owner tentando informar `tenantId` de outro tenant (deveria ser ignorado/rejeitado, já que dono só gerencia o próprio) → comportamento a definir na implementação (provavelmente ignorar o parâmetro e usar sempre `req.account.tenantId` quando existir)

## Frontend

- [ ] Nova tela pra staff escolher qual tenant gerenciar antes de ver `/dashboard/modulos` — ex. lista simples de tenants (nome + e-mail do dono) com busca, sem paginação sofisticada nesta rodada
- [ ] `/dashboard/modulos` aceita um parâmetro (`?tenantId=`) quando acessado por staff; quando acessado pelo dono/operador do tenant, continua funcionando como hoje (sem precisar de parâmetro)

## Definition of Done

- [ ] Um consultant consegue abrir os módulos de um tenant que não é "dele" (ele não tem tenant) e ligar/desligar um módulo
- [ ] Um dono de tenant continua vendo só os módulos do próprio negócio, sem precisar escolher tenant nenhum
