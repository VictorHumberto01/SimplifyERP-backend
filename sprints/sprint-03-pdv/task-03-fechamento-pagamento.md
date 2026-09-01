# Task 03 — Fechamento e pagamento

**Sprint**: sprint-03-pdv
**Módulo(s)**: PDV

## Objetivo

O operador registra o pagamento e fecha a comanda, concluindo o ciclo de atendimento do MVP.

## Backend

- [ ] Entidade `Payment` e value object `Money` (ver [`../../docs/domain-model.md`](../../docs/domain-model.md))
- [ ] Endpoint `POST /tabs/:id/payments`: registra um ou mais pagamentos (suporte a pagamento parcial/dividido, se no escopo)
- [ ] Endpoint `POST /tabs/:id/close`: fecha a comanda quando o valor pago cobre o total
- [ ] Eventos de domínio `PaymentRegistered` e `TabClosed`

## Frontend

- [ ] Tela de fechamento de comanda: forma(s) de pagamento, valor recebido, troco (se aplicável)
- [ ] Confirmação visual de comanda fechada
- [ ] Comanda fechada some da lista de comandas abertas do PDV

## Definition of Done

- [ ] Operador registra o pagamento e fecha a comanda pela UI
- [ ] Comanda fechada não pode receber novos itens ou pagamentos
