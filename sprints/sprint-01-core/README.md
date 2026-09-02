# Sprint 01 — Core

**Objetivo**: um super admin consegue criar um tenant (cliente) com seu dono, o dono consegue fazer login e ver as configurações do seu estabelecimento — a base de identidade sobre a qual todos os outros módulos (Cardápio Digital, PDV, ...) se apoiam.

Módulo de domínio: **Core** (ver [`../../docs/domain-model.md`](../../docs/domain-model.md)).

**Nota**: o objetivo original desta sprint previa cadastro self-service (o próprio dono se cadastrando). Isso mudou no meio da sprint — por enquanto o app é distribuído como consultoria, então só `super_admin` cria tenants. Ver [`task-01-onboarding`](./task-01-onboarding.md) para o histórico.

## Tarefas

| Tarefa | Descrição | Status |
|---|---|---|
| [`task-01-onboarding`](./task-01-onboarding.md) | Criação de tenant + dono (hoje restrita a super admin) | Concluída |
| [`task-02-autenticacao`](./task-02-autenticacao.md) | Login, emissão de JWT, proteção de rotas | Concluída (UI de MFA fora de escopo) |
| [`task-03-modulos-habilitados`](./task-03-modulos-habilitados.md) | Ligar/desligar módulos por estabelecimento | Concluída |
