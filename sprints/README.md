# Sprints

Planejamento de execução do SimplifyERP, organizado em sprints. Cada sprint agrupa as tarefas necessárias para entregar um pedaço vertical de valor — e **cada tarefa cobre tanto backend quanto frontend**, já que o objetivo é sempre entregar uma funcionalidade utilizável ponta a ponta, não uma camada isolada.

O escopo das sprints segue a ordem definida em [`../docs/roadmap.md`](../docs/roadmap.md) e os módulos descritos em [`../docs/modules.md`](../docs/modules.md).

## Estrutura

```
sprints/
  sprint-00-fundacao/
    README.md          # objetivo da sprint e lista de tarefas
    task-01-*.md
    task-02-*.md
  sprint-01-core/
    README.md
    task-01-*.md
    ...
  sprint-02-cardapio-digital/
    ...
  sprint-03-pdv/
    ...
```

Cada sprint tem um `README.md` com o objetivo da sprint e a lista de tarefas, e cada tarefa é um arquivo `task-NN-nome.md` próprio.

## Template de tarefa

Toda tarefa segue este formato (ver exemplos nas sprints já criadas):

```markdown
# Task NN — Título

**Sprint**: sprint-XX-nome
**Módulo(s)**: Core / Cardápio Digital / PDV / ...

## Objetivo

O que essa tarefa entrega, em uma frase, do ponto de vista do usuário final.

## Backend

- [ ] ...

## Frontend

- [ ] ...

## Definition of Done

- [ ] Backend e frontend integrados e testados manualmente ponta a ponta
- [ ] ...
```

## Sprints

| Sprint | Objetivo | Status |
|---|---|---|
| [`sprint-00-fundacao`](./sprint-00-fundacao) | Infraestrutura, scaffolding e setup dos dois repositórios | Em andamento |
| [`sprint-01-core`](./sprint-01-core) | Autenticação, tenants e configuração do estabelecimento | Não iniciada |
| [`sprint-02-cardapio-digital`](./sprint-02-cardapio-digital) | Cardápio publicável e pedidos via QR Code | Não iniciada |
| [`sprint-03-pdv`](./sprint-03-pdv) | Frente de caixa: itens, descontos, fechamento de comanda | Não iniciada |
