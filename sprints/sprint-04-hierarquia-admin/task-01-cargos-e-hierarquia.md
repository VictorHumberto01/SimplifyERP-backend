# Task 01 — Cargos e hierarquia de criação

**Sprint**: sprint-04-hierarquia-admin
**Módulo(s)**: Core

## Objetivo

Existem contas `manager` e `consultant`, e cada uma só pode ser criada por alguém de cargo mais alto — `super_admin` cria `manager`, `manager` cria `consultant`. Consultor passa a poder criar tenants (hoje só `super_admin` consegue).

## Backend

- [ ] `AccountRole` (`src/modules/core/entities/value-objects/role.ts`) ganha `MANAGER = "manager"` e `CONSULTANT = "consultant"`
- [ ] `Role` ganha uma noção de hierarquia/rank entre os cargos de staff (`CONSULTANT < MANAGER < SUPER_ADMIN`) — ex. um método `outranks(other: AccountRole)` — para permitir checagens genéricas de "cargo X pode gerenciar cargo Y", sem hardcodear `if/else` em cada service. `OWNER`/`OPERATOR` (roles de tenant) ficam fora dessa hierarquia — não fazem sentido comparados a cargos de staff
- [ ] Migration: `User.active Boolean @default(true)` — distinto de `deletedAt` (soft-delete já existente); reversível
- [ ] Endpoint `POST /v1/admin/managers` — cria conta `manager`; restrito a `super_admin` (reaproveitar o padrão de `SignupService`/`CreateAccountUseCase`, sem tenant associado)
- [ ] Endpoint `POST /v1/admin/consultants` — cria conta `consultant`; restrito a `manager` ou `super_admin`
- [ ] `SignupService` (`POST /v1/signup`): trocar a checagem de "só `super_admin`" para "qualquer cargo de staff" (`super_admin`, `manager` ou `consultant`)
- [ ] Domain event `StaffAccountCreated` (tenantId não se aplica — carrega `accountId`, `role`, `createdBy`)
- [ ] Testes: consultor tentando criar manager/consultant → 403; manager criando consultant → 201; manager tentando criar outro manager → 403

## Frontend

- [ ] Nova área `/dashboard/equipe` (nome sujeito a ajuste), visível conforme o cargo de quem está logado:
  - `super_admin` vê e cria `manager`
  - `manager` vê e cria `consultant`
  - `consultant` não vê essa área
- [ ] `/dashboard/tenants/novo` (hoje só visível a `super_admin`) passa a aparecer também para `manager` e `consultant`
- [ ] Nav do dashboard reflete os 3 níveis de cargo, não só `super_admin`/resto

## Definition of Done

- [ ] Super admin cria manager; manager cria consultant; consultant não consegue criar ninguém (403)
- [ ] Manager não consegue criar outro manager (403)
- [ ] Consultant consegue criar tenant + dono via `POST /v1/signup` (hoje só super admin consegue)
