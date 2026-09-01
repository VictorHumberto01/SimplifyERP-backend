# Task 03 — Envio de pedido

**Sprint**: sprint-02-cardapio-digital
**Módulo(s)**: Cardápio Digital

## Objetivo

O cliente monta um pedido a partir do cardápio e o envia direto para o estabelecimento, pelo próprio celular.

## Backend

- [ ] Aggregate `Order` com entidade `OrderItem` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoint público `POST /public/orders`: cria um pedido associado a mesa + estabelecimento
- [ ] Evento de domínio `OrderPlaced`

## Frontend

- [ ] Carrinho/seleção de itens na página pública do cardápio
- [ ] Tela de confirmação do pedido (revisão antes de enviar)
- [ ] Feedback visual de "pedido enviado" após o `POST /public/orders`

## Definition of Done

- [ ] Cliente consegue montar e enviar um pedido pela página pública sem login
- [ ] Pedido enviado é persistido corretamente associado à mesa e ao estabelecimento certos
