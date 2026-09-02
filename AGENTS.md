# AGENTS.md — SimplifyERP Backend

Contexto rápido para qualquer agente (ou humano) que for mexer neste repositório.

## O que é o SimplifyERP

Sistema de gestão para pequenos negócios (restaurantes, lojas, cafés) que substitui caderno de estoque +
app de vendas + planilha financeira por um hub único. Módulos ligam/desligam conforme o negócio cresce —
o cliente só paga pela complexidade que usa. Visão de produto completa em [`docs/`](./docs), especialmente
[`docs/modules.md`](./docs/modules.md) e [`docs/roadmap.md`](./docs/roadmap.md).

**Modelo de distribuição atual (importante):** por enquanto o app é entregue como uma consultoria — não
existe cadastro público self-service. Só uma conta `super_admin` pode criar um novo tenant (com seu dono),
via `POST /v1/signup` autenticado. Ver `src/modules/core/services/tenant/signup-service.ts`. Isso pode mudar
no futuro (self-service real), mas hoje é a regra.

## Arquitetura

Monolito Modular com DDD como design de código — ver [`docs/architecture.md`](./docs/architecture.md) e
[`docs/domain-model.md`](./docs/domain-model.md) para o racional completo. Na prática, cada módulo de negócio
vive em `src/modules/<nome>/` e segue esta convenção interna (não é exatamente `domain/application/infrastructure/interface`
como os docs idealizam — é isto aqui, que é o padrão real do código):

```
src/modules/<modulo>/
  entities/                 # Aggregates/Entities + entities/value-objects/
  events/                   # Domain events do módulo
  repositories/             # Interfaces (ex. ITenantRepository)
  persistence/prisma/       # Implementação Prisma dos repositórios + mappers
  use-cases/                # Regra de negócio pura, uma classe por caso de uso
  services/                 # Orquestração (chama use-cases, dispara eventos, valida permissão)
  dtos/                     # Shapes de entrada/saída
  http/
    controllers/            # Lê req, chama service, formata resposta
    routes/                 # Registra rotas Fastify + preHandlers (authenticate, httpValidate)
    validations/            # Schemas yup
    presenters/             # Entidade de domínio -> JSON de resposta
  tests/                    # Factories + repositórios in-memory pra teste unitário
  container.ts              # Registro de DI (tsyringe) do módulo
```

Hoje só existe um módulo real: `src/modules/core` (foi renomeado de `identity-access` na Sprint 00 — ele
concentra auth, Tenant, Establishment e EnabledModule, que é exatamente o bounded context "Core" do domain
model). Módulos futuros (Cardápio Digital, PDV, ...) devem seguir a mesma estrutura, isolados uns dos outros
— comunicação entre módulos só via contratos explícitos ou domain events, nunca acessando o domínio um do
outro diretamente.

**Padrões que valem a pena conhecer antes de mexer:**
- Autorização por role é feita na camada de **service**, não em middleware: `requester.role.hasPermission(AccountRole.SUPER_ADMIN)` → `throw new ForbiddenError(...)`. Não existe guard de rota por role — `authenticate` (`src/infra/http/middlewares/authenticate.ts`) só verifica o JWT e popula `req.account`.
- Transações usam `IUnitOfWork.runInTransaction(work)` (`src/infra/database/prisma/unit-of-work/`). Repositórios que precisam participar de uma transação aceitam um `tx?` opcional por chamada (`save(entity, tx)`), com fallback pro client Prisma default.
- `errorResponseBuilder` de rotas com rate limit (`@fastify/rate-limit`) precisa devolver `{ statusCode, message }` — devolver só `{ error: "..." }` sem `statusCode` faz a resposta virar 500 em vez de 429 (bug real que já existiu aqui, ver `signup-routes.ts`/`auth-routes.ts`).
- Erros de domínio (`BadRequestError`, `DuplicateResourceError`, `ForbiddenError`, `ResourceNotFoundError`, `UnauthorizedError`, em `src/core/errors/`) são mapeados pro HTTP certo em `src/infra/http/app.ts` via `fastifyErrorHandler`.

## Stack

TypeScript, Fastify, Prisma (PostgreSQL), Redis, BullMQ, tsyringe (DI), Vitest. Detalhes e variáveis de
ambiente no [`README.md`](./README.md).

## Como as sprints estão organizadas

Todo o planejamento de execução vive em [`sprints/`](./sprints), documentado mesmo estando no repo backend
(as tarefas cruzam backend + frontend). Ver [`sprints/README.md`](./sprints/README.md) pro template e convenção
completos. Resumo:

- Uma pasta por sprint (`sprints/sprint-NN-nome/`), com um `README.md` (objetivo + lista de tarefas) e um
  arquivo por tarefa (`task-NN-nome.md`).
- Cada tarefa tem checklist separado de **Backend** e **Frontend** (toda tarefa entrega algo ponta a ponta,
  não uma camada isolada) e uma seção **Definition of Done**.
- Sprints concluídas guardam nos arquivos de task o que foi de fato feito, incluindo decisões tomadas no
  caminho e cortes de escopo explícitos — leia a task antes de assumir que algo não existe.

Status atual: **Sprint 00 (Fundação)** e **Sprint 01 (Core)** concluídas — scaffold, infra local, CI,
autenticação, multi-tenancy (Tenant/Establishment), módulos habilitáveis por tenant, e a restrição de
signup a super admin (ver nota do modelo de consultoria acima). Próximas sprints (Cardápio Digital, PDV)
ainda não começaram — ver [`sprints/README.md`](./sprints/README.md) pra tabela de status atualizada.

## Testes

Vitest, com repositórios in-memory por módulo (`src/modules/<modulo>/tests/in-memory-*.ts`) — não precisa de
Postgres/Redis rodando pra rodar `npm test`. Specs ficam ao lado do arquivo testado (`*.spec.ts`), não numa
pasta separada. `src/tests/setup-unit.ts` já popula todas as env vars necessárias pro ambiente de teste.
