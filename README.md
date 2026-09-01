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

Planejamento de execução (sprints e tarefas, cada uma cobrindo backend + frontend) em [`sprints/`](./sprints).

## Stack

- **Linguagem**: TypeScript
- **Framework HTTP**: [Fastify](https://fastify.dev)
- **Banco de dados**: PostgreSQL, via [Prisma ORM](https://www.prisma.io)
- **Cache / sessões / filas**: Redis + [BullMQ](https://docs.bullmq.io)
- **Autenticação**: JWT (access + refresh tokens), MFA via TOTP opcional
- **Design de código**: Domain-Driven Design (DDD) sobre um Monolito Modular
- **Injeção de dependência**: [tsyringe](https://github.com/microsoft/tsyringe)
- **Integrações opcionais** (não bloqueiam o boot se não configuradas): [Resend](https://resend.com) (e-mail transacional), [Sentry](https://sentry.io) (observabilidade de erros)
- **Armazenamento de arquivos**: [MinIO](https://min.io) (ex. logo do estabelecimento, fotos do cardápio)

## Getting Started

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 LTS ou superior
- npm (gerenciador de pacotes)
- [Docker](https://www.docker.com) + Docker Compose (para subir Postgres, Redis e MinIO localmente)

### Subindo a infraestrutura local

```bash
docker compose up -d postgres redis minio
```

Sobe os containers de PostgreSQL, Redis e MinIO usados em desenvolvimento (ver `docker-compose.yaml` na raiz do projeto — os serviços `migrate` e `api` do compose são voltados para build de produção/staging).

### Instalação

```bash
npm install
cp .env.example .env
npm run db:migrate:dev
```

### Variáveis de ambiente

Ver [`.env.example`](./.env.example) para a lista completa com valores de exemplo. As obrigatórias para o servidor subir são:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Segredo (mín. 32 caracteres) usado para assinar os tokens de autenticação |
| `FRONTEND_URL` | URL do frontend, usada em CORS e em links de e-mail (ex. reset de senha) |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Credenciais da conta de superadministrador criada automaticamente no boot |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | Credenciais do MinIO |

`MFA_ENCRYPTION_KEY`, `SENTRY_DSN` e `RESEND_API_KEY` são opcionais: sem eles o servidor sobe normalmente e o respectivo recurso (MFA, observabilidade, envio de e-mail) fica indisponível em vez de derrubar o boot.

### Scripts npm

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe a API em modo desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript para produção (`dist/`) |
| `npm start` | Roda a API a partir do build de produção |
| `npm test` | Executa a suíte de testes (Vitest) |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run db:migrate:dev` | Aplica migrations do Prisma em desenvolvimento |
| `npm run db:migrate:deploy` | Aplica migrations do Prisma em produção/staging |
| `npm run lint` | Executa o linter |
| `npm run format` | Formata o código com Prettier |

## Repositório relacionado

- Frontend (Next.js): [SimplifyERP-frontend](https://github.com/VictorHumberto01/SimplifyERP-frontend)
