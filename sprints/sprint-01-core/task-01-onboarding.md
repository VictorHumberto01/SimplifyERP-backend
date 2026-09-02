# Task 01 — Onboarding (criação de tenant)

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

~~O dono de um negócio cria sua conta, o tenant e o estabelecimento sozinho, sem taxa de implantação nem intervenção manual.~~

**Atualizado**: por enquanto o app é entregue como uma consultoria, não como self-service. Só uma conta
`super_admin` cria um novo tenant (com seu dono) — o dono não se auto-cadastra. Self-service público pode
voltar a ser o modelo no futuro; se isso mudar, revisar `SignupService` (`hasPermission(AccountRole.SUPER_ADMIN)`)
e a rota `POST /v1/signup` (hoje exige `authenticate`).

## Backend

- [x] Aggregate `Tenant` e entidade `Establishment` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [x] Endpoint `POST /v1/signup`: cria `Tenant`, `Establishment` e `User` (dono) numa única transação (exigiu consertar o `PrismaUnitOfWork`, que estava quebrado — `begin()` fechava a transação antes de retornar; trocado por `runInTransaction`)
- [x] Restrito a `super_admin`: rota exige `authenticate` + `SignupService` checa `requester.role.hasPermission(AccountRole.SUPER_ADMIN)`, senão `ForbiddenError` (403)
- [x] Validação de e-mail único (`Email` value object) e regras básicas de senha
- [x] Evento de domínio `TenantCreated`
- [x] Bug encontrado e corrigido no caminho: `errorResponseBuilder` das rotas com rate limit (`signup`, e as 6 de `auth-routes.ts`) não devolvia `statusCode`, então estourar o limite virava 500 em vez de 429

## Frontend

- [x] Página de criação de tenant em `/dashboard/tenants/novo` (protegida — só aparece no menu para `super_admin`), não mais um `/signup` público
- [x] Chamada ao `POST /v1/signup` via proxy `app/api/admin/tenants` (repassa o cookie do super admin como `Authorization`, **não** troca a sessão pelo do novo dono)
- [x] Tela de confirmação mostra e-mail/senha/token inicial pra repassar ao cliente, com opção de cadastrar outro tenant

## Definition of Done

- [x] Um super admin consegue criar um tenant pela UI e o tenant/estabelecimento aparecem no banco — validado via Playwright
- [x] Tentativa de criação com e-mail duplicado é rejeitada com mensagem clara na UI — validado via curl (409)
- [x] Requisição sem autenticação é rejeitada (401) — validado via curl
- [x] Usuário autenticado sem role `super_admin` (ex. um `owner`) é rejeitado (403) — validado via curl e Playwright
