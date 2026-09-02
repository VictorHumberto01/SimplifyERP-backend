# Task 02 — Autenticação

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

Usuários cadastrados conseguem fazer login e acessar áreas protegidas do sistema (painel do estabelecimento, PDV).

## Backend

- [x] Endpoint `POST /v1/auth/login`: valida credenciais e emite JWT (já existia no scaffold reciclado, validado nesta rodada)
- [x] Middleware Fastify de autenticação (`authenticate`, já existia)
- [x] `Role` (value object) ganhou `OWNER` e `OPERATOR` além de `SUPER_ADMIN`/`USER` — sem fluxo de convite de operador ainda (ver corte de escopo)
- [x] `UserAuthenticated`: decisão deliberada de **não** criar um evento novo — `AccountLoggedInEvent` (já existente) cobre a mesma informação e já dispara tanto no login quanto no signup

## Frontend

- [x] Página de login (`/login`)
- [x] Armazenamento seguro do token de sessão via cookie httpOnly (`simplifyerp_session`), setado por `app/api/auth/login`
- [x] Guarda de rotas: `src/proxy.ts` (Next.js 16 renomeou `middleware.ts` para `proxy.ts`) redireciona `/dashboard/*` para `/login` quando o cookie não existe
- [x] Logout (`app/api/auth/logout` + botão no layout do dashboard)

## Definition of Done

- [x] Login com credenciais válidas dá acesso a uma rota protegida; credenciais inválidas são rejeitadas — validado via curl e Playwright
- [x] Acessar uma rota protegida sem estar autenticado redireciona para o login — validado via Playwright

## Corte de escopo

- UI de desafio MFA no login não foi implementada — o backend já suporta (`mfaRequired`), o proxy de login repassa a informação, mas a página apenas mostra uma mensagem em vez de um fluxo de verificação.
- `AccountRole.OPERATOR` existe no enum mas nenhum fluxo ainda cria um operador (não há convite de equipe nesta sprint).
