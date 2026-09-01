# Task 01 — Onboarding self-service

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

O dono de um negócio cria sua conta, o tenant e o estabelecimento sozinho, sem taxa de implantação nem intervenção manual.

## Backend

- [ ] Aggregate `Tenant` e entidade `Establishment` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoint `POST /signup`: cria `Tenant`, `Establishment` e `User` (dono) numa única transação
- [ ] Validação de e-mail único (`Email` value object) e regras básicas de senha
- [ ] Evento de domínio `TenantCreated`

## Frontend

- [ ] Página de cadastro (`/onboarding` ou `/signup`) com formulário: dados do dono + dados do estabelecimento
- [ ] Chamada ao `POST /signup` e tratamento de erros (e-mail já usado, validação)
- [ ] Redirecionamento pós-cadastro para o login ou direto para o painel autenticado

## Definition of Done

- [ ] Um usuário novo consegue se cadastrar pela UI e o tenant/estabelecimento aparecem no banco
- [ ] Tentativa de cadastro com e-mail duplicado é rejeitada com mensagem clara na UI
