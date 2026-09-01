# Task 04 — Painel de pedidos em tempo real

**Sprint**: sprint-02-cardapio-digital
**Módulo(s)**: Cardápio Digital

## Objetivo

Pedidos feitos pelo cliente caem diretamente no painel da loja, sem intervenção manual — a integração nativa entre Cardápio Digital e o restante da operação (ver [`../../docs/system-design.md`](../../docs/system-design.md)).

## Backend

- [ ] Endpoint interno `GET /orders?status=pending`: lista pedidos pendentes do estabelecimento
- [ ] Endpoint interno `PATCH /orders/:id/status`: avança o status do pedido (recebido → em preparo → pronto)
- [ ] Mecanismo de atualização em tempo real (polling curto no MVP, ou WebSocket/SSE se viável no prazo)

## Frontend

- [ ] Painel interno listando pedidos pendentes, atualizado em tempo real (ou near-real-time)
- [ ] Ação para operador avançar o status do pedido

## Definition of Done

- [ ] Um pedido enviado pela página pública aparece no painel interno sem precisar recarregar a página manualmente
- [ ] Operador consegue mudar o status do pedido pela UI e o cliente (se aplicável) reflete o novo status
