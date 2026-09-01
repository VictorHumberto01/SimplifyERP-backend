# SimplifyERP — Backend

> Tecnologia escalável, integrada e sem custos abusivos para impulsionar pequenos negócios.

O SimplifyERP é um sistema de gestão que atua como **hub centralizador** da operação de uma loja ou restaurante — eliminando a necessidade de usar múltiplas ferramentas desconexas (app de vendas, caderno de estoque, planilha financeira).

Este repositório contém a **API backend**: o Core do sistema e todos os módulos de negócio.

## O problema que resolvemos

- **Desconexão de ferramentas** — o pequeno empreendedor hoje gerencia vendas em um app, estoque em um caderno e financeiro em planilhas.
- **Custo proibitivo e inflexibilidade** — softwares de gestão tradicionais cobram taxas de implantação caras e forçam o cliente a pagar por recursos que ele não usa.
- **Curva de aprendizado lenta** — sistemas legados exigem semanas de treinamento.

A resposta do SimplifyERP: onboarding self-service, sem taxa de implantação, e **time-to-value < 30 minutos** (cadastrar cardápio e começar a tirar pedidos).

## Arquitetura

O backend é um **Monolito Modular** desenhado com **DDD (Domain-Driven Design)** como design de código: módulos de negócio isolados internamente (cada um seu próprio *Bounded Context*), compartilhando o mesmo banco de dados para integração nativa em tempo real, sem o custo operacional de uma malha de microsserviços.

Documentação completa em [`docs/`](./docs):

| Documento | Conteúdo |
|---|---|
| [`docs/architecture.md`](./docs/architecture.md) | Por que Monolito Modular, estrutura de alto nível, diagrama de infraestrutura |
| [`docs/system-design.md`](./docs/system-design.md) | Fluxo de dados ponta a ponta, papel de Postgres/Redis/BullMQ, requisitos não-funcionais |
| [`docs/domain-model.md`](./docs/domain-model.md) | DDD tático — Bounded Contexts, Aggregates, Entities, Value Objects, convenção de camadas |
| [`docs/modules.md`](./docs/modules.md) | Escopo do MVP e módulos futuros (crescimento sob demanda) |
| [`docs/roadmap.md`](./docs/roadmap.md) | Fases de desenvolvimento e adoção |

## Stack

- **Linguagem**: TypeScript
- **Framework HTTP**: [Fastify](https://fastify.dev)
- **Banco de dados**: PostgreSQL
- **Cache / sessões**: Redis
- **Filas assíncronas**: [BullMQ](https://docs.bullmq.io)
- **Design de código**: Domain-Driven Design (DDD) sobre um Monolito Modular

## Getting Started

> O código-fonte ainda está sendo estruturado. Esta seção documenta o setup planejado para guiar a implementação inicial.

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 LTS ou superior
- [pnpm](https://pnpm.io) (gerenciador de pacotes)
- [Docker](https://www.docker.com) + Docker Compose (para subir Postgres e Redis localmente)

### Subindo a infraestrutura local

```bash
docker compose up -d
```

Isso deve subir os containers de PostgreSQL e Redis usados em desenvolvimento (ver `docker-compose.yml` na raiz do projeto).

### Instalação

```bash
pnpm install
cp .env.example .env
```

### Variáveis de ambiente esperadas

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta em que a API Fastify escuta | `3000` |
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://user:pass@localhost:5432/simplify_erp` |
| `REDIS_URL` | Connection string do Redis (cache e filas do BullMQ) | `redis://localhost:6379` |
| `JWT_SECRET` | Segredo usado para assinar tokens de autenticação do Core | — |
| `NODE_ENV` | Ambiente de execução | `development` \| `production` |

### Scripts npm planejados

| Script | Descrição |
|---|---|
| `pnpm dev` | Sobe a API em modo desenvolvimento com hot-reload |
| `pnpm build` | Compila o TypeScript para produção |
| `pnpm start` | Roda a API a partir do build de produção |
| `pnpm test` | Executa a suíte de testes |
| `pnpm migrate` | Aplica as migrations do banco de dados |
| `pnpm lint` | Executa o linter |

## Repositório relacionado

- Frontend (Next.js): [SimplifyERP-frontend](https://github.com/VictorHumberto01/SimplifyERP-frontend)
