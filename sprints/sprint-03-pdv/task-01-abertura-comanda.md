# Task 01 — Abertura de comanda

**Sprint**: sprint-03-pdv
**Módulo(s)**: PDV, Cardápio Digital (leitura)

## Objetivo

O operador do balcão abre uma comanda manualmente, ou uma comanda é aberta automaticamente a partir de um pedido feito no Cardápio Digital.

## Backend

- [ ] Aggregate `Tab` (comanda) (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoint `POST /tabs`: abre comanda manualmente (balcão) ou a partir de um `Order` existente
- [ ] Endpoint `GET /tabs?status=open`: lista comandas abertas do estabelecimento

## Frontend

- [ ] Tela do PDV listando comandas abertas
- [ ] Ação de abrir nova comanda manualmente
- [ ] Comandas originadas do Cardápio Digital aparecem automaticamente na lista

## Definition of Done

- [ ] Operador consegue abrir uma comanda manualmente pelo PDV
- [ ] Um pedido feito no Cardápio Digital gera/associa uma comanda visível no PDV sem passo manual extra
