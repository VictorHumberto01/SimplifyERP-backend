# Roadmap

O desenvolvimento segue a mesma lógica que o produto oferece ao cliente: começar pequeno e essencial, e expandir sob demanda.

## Fase 1 — MVP

Objetivo: um restaurante consegue cadastrar seu cardápio e começar a tirar pedidos em **menos de 30 minutos**, sem taxa de implantação e sem suporte técnico presencial.

- [ ] **Core do Sistema** — autenticação, gestão de usuários, cadastro de estabelecimento, módulos habilitados por tenant.
- [ ] **Cardápio Digital** — cardápio publicável, atendimento de mesa via QR Code, recebimento de pedidos em tempo real.
- [ ] **Frente de Caixa (PDV)** — lançamento de itens, descontos, fechamento de comanda e pagamento.

## Fase 2 — Estoque & Insumos

- [ ] Ficha técnica por item do cardápio.
- [ ] Baixa automática de ingredientes a partir dos pedidos do PDV/Cardápio Digital.
- [ ] Alertas de estoque mínimo.
- [ ] Curva ABC para priorização de compras.

## Fase 3 — Gestão Financeira

- [ ] Contas a pagar/receber.
- [ ] Fluxo de caixa diário.
- [ ] Conciliação de cartões.
- [ ] DRE simplificado.

## Fase 4 — Fiscal e Relatórios

- [ ] Emissão automatizada de NFC-e/NF-e integrada à venda.
- [ ] Painéis de desempenho, ticket médio, produtos mais vendidos.

> As fases não têm data comprometida — refletem apenas a ordem lógica de expansão do produto, alinhada à filosofia de módulos ligados sob demanda ([`modules.md`](./modules.md)).

## Documentos relacionados

- [`architecture.md`](./architecture.md)
- [`modules.md`](./modules.md)
