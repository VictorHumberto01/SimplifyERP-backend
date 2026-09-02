# Task 02 — Desativar conta de staff

**Sprint**: sprint-04-hierarquia-admin
**Módulo(s)**: Core

## Objetivo

Um `manager` consegue desativar um `consultant`, e um `super_admin` consegue desativar um `manager` (ou um `consultant`, por herança) — sem apagar a conta, só bloqueando o acesso. Reverter a desativação fica fora desta tarefa (ver corte de escopo no README da sprint).

## Backend

- [ ] Endpoint `PATCH /v1/admin/staff/:accountId/deactivate` — restrito a quem tem cargo mais alto que o alvo (usa a hierarquia da [`task-01`](./task-01-cargos-e-hierarquia.md)); rejeita desativar a própria conta e desativar alguém de cargo igual ou maior (`ForbiddenError`)
- [ ] `CredentialsLoginService`: rejeitar login (`UnauthorizedError`) quando `account.active === false`, com mensagem clara ("Esta conta foi desativada.")
- [ ] Revogar sessões ativas da conta desativada (reaproveitar `RevokeAllSessionsUseCase`, mesmo padrão do `ChangePasswordService`)
- [ ] Domain event `StaffAccountDeactivated` (`accountId`, `deactivatedBy`)
- [ ] Testes: manager desativando consultant → ok; consultant tentando desativar alguém → 403; manager tentando desativar outro manager ou o super → 403; conta desativada tentando logar → 401

## Frontend

- [ ] Na área de equipe (`/dashboard/equipe` da task-01), botão "Desativar" em cada linha — só aparece se o cargo de quem está logado for maior que o da conta listada
- [ ] Confirmação antes de desativar (ação sensível, difícil de reverter na UI ainda que reversível no banco)
- [ ] Conta desativada some da lista de "ativos" (ou aparece com badge "Desativado", a definir na implementação)

## Definition of Done

- [ ] Manager desativa um consultant pela UI; o consultant não consegue mais logar (mensagem clara, não um erro genérico)
- [ ] Consultant não vê opção de desativar ninguém
- [ ] Manager não consegue desativar outro manager nem o super admin
