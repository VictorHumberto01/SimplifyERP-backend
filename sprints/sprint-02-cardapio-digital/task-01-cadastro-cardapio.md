# Task 01 — Cadastro de cardápio

**Sprint**: sprint-02-cardapio-digital
**Módulo(s)**: Cardápio Digital

## Objetivo

O dono do estabelecimento cadastra e publica seu cardápio (itens e preços) — o primeiro passo da meta de time-to-value < 30 minutos.

## Backend

- [ ] Aggregate `Menu` com entidade interna `MenuItem` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoints CRUD: `POST/GET/PATCH/DELETE /menu` e `/menu/items`
- [ ] Value object `Price`
- [ ] Evento de domínio `MenuPublished`

## Frontend

- [ ] Tela interna de gestão de cardápio (listar, criar, editar, remover itens)
- [ ] Ação de "publicar cardápio"

## Definition of Done

- [ ] Dono consegue cadastrar itens com nome, descrição e preço, e publicar o cardápio
- [ ] Cardápio publicado é o mesmo consumido pela página pública (task seguinte)
