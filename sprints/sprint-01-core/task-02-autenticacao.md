# Task 02 — Autenticação

**Sprint**: sprint-01-core
**Módulo(s)**: Core

## Objetivo

Usuários cadastrados conseguem fazer login e acessar áreas protegidas do sistema (painel do estabelecimento, PDV).

## Backend

- [ ] Endpoint `POST /login`: valida credenciais e emite JWT
- [ ] Middleware Fastify de autenticação (valida JWT em rotas protegidas)
- [ ] Modelagem de `Role` (value object) para controle de acesso por papel (dono vs. operador)
- [ ] Evento de domínio `UserAuthenticated`

## Frontend

- [ ] Página de login
- [ ] Armazenamento seguro do token de sessão (ex. cookie httpOnly via rota de API do Next.js)
- [ ] Guarda de rotas: redireciona para login quando não autenticado
- [ ] Logout

## Definition of Done

- [ ] Login com credenciais válidas dá acesso a uma rota protegida; credenciais inválidas são rejeitadas
- [ ] Acessar uma rota protegida sem estar autenticado redireciona para o login
