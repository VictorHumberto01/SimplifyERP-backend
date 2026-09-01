# Domain Model (DDD)

O backend usa **Domain-Driven Design** como design de código. Cada módulo de negócio é um **Bounded Context** isolado, com seu próprio modelo de domínio — dois módulos podem ter conceitos com o mesmo nome (ex.: "Item") com significados diferentes, e isso é intencional.

## Bounded Contexts

### MVP

| Bounded Context | Responsabilidade |
|---|---|
| **Core** | Identidade, autenticação, tenants/estabelecimentos, módulos habilitados |
| **Cardápio Digital** | Atendimento de mesa via QR Code, montagem e envio de pedidos |
| **PDV (Frente de Caixa)** | Lançamento de itens no balcão, descontos, fechamento de comandas e pagamentos |

### Futuros (pós-MVP)

| Bounded Context | Responsabilidade |
|---|---|
| **Estoque & Insumos** | Ficha técnica, baixa automática de ingredientes, alertas de estoque mínimo, curva ABC |
| **Gestão Financeira** | Contas a pagar/receber, fluxo de caixa, conciliação de cartões, DRE simplificado |
| **Fiscal e Relatórios** | Emissão de NFC-e/NF-e, painéis de desempenho, ticket médio, produtos mais vendidos |

## Modelo tático por contexto (MVP)

### Core

- **Aggregates**: `Tenant` (raiz), `User`
- **Entities**: `Establishment`, `EnabledModule`
- **Value Objects**: `Email`, `Role`
- **Domain Events**: `TenantCreated`, `ModuleEnabled`, `UserAuthenticated`

### Cardápio Digital

- **Aggregates**: `Menu` (raiz, contém `MenuItem` como entidade interna), `Order` (raiz)
- **Entities**: `MenuItem`, `OrderItem`, `Table`
- **Value Objects**: `Price`, `QrCodeToken`
- **Domain Events**: `OrderPlaced`, `MenuPublished`

### PDV

- **Aggregates**: `Tab` (comanda, raiz)
- **Entities**: `TabItem`, `Payment`
- **Value Objects**: `Discount`, `Money`
- **Domain Events**: `TabClosed`, `PaymentRegistered`

> O modelo tático dos módulos futuros (Estoque, Financeiro, Fiscal) será detalhado quando cada um entrar em desenvolvimento — ver [`roadmap.md`](./roadmap.md).

## Convenção de camadas por módulo

Cada Bounded Context segue a mesma estrutura interna:

```
modules/
  <nome-do-modulo>/
    domain/           # Aggregates, Entities, Value Objects, Domain Events, regras de negócio puras
    application/       # Use cases / application services, orquestração sem lógica de infra
    infrastructure/     # Implementação de repositórios, integração com Postgres/Redis/BullMQ
    interface/           # Rotas Fastify, controllers, DTOs/schemas de entrada e saída
```

## Regra de comunicação entre módulos

Módulos **não acessam o modelo de domínio uns dos outros diretamente**. Toda comunicação entre Bounded Contexts acontece por:

- **Contratos explícitos** (interfaces/DTOs expostos pela camada `application` de cada módulo), ou
- **Domain Events**, quando a comunicação pode ser assíncrona (ex.: um evento do PDV que futuramente dispara baixa de estoque).

Isso preserva o isolamento lógico dos módulos mesmo compartilhando o mesmo processo e banco de dados — é o que permite ligar/desligar módulos sem quebrar os demais.

## Documentos relacionados

- [`architecture.md`](./architecture.md) — visão geral do Monolito Modular.
- [`modules.md`](./modules.md) — escopo funcional de cada módulo.
