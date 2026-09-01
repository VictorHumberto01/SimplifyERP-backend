# Task 02 — Lançamento de itens e desconto

**Sprint**: sprint-03-pdv
**Módulo(s)**: PDV

## Objetivo

O operador lança itens extras numa comanda aberta e aplica descontos, com agilidade de balcão.

## Backend

- [ ] Entidade `TabItem` e value object `Discount` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoint `POST /tabs/:id/items`: adiciona item à comanda
- [ ] Endpoint `PATCH /tabs/:id/discount`: aplica desconto (percentual ou valor fixo) à comanda

## Frontend

- [ ] Interface ágil de lançamento de itens na comanda (busca rápida por item do cardápio)
- [ ] Ação de aplicar desconto, com validação (ex. limite máximo, se houver)
- [ ] Total da comanda atualizado em tempo real na tela conforme itens/descontos mudam

## Definition of Done

- [ ] Operador lança um item e vê o total da comanda atualizar imediatamente
- [ ] Desconto aplicado reflete corretamente no total da comanda
