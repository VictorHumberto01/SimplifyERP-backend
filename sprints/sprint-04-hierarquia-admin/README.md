# Sprint 04 — Hierarquia de administradores

**Objetivo**: hoje só o `super_admin` cria tenants (ver [`sprint-01-core/task-01-onboarding`](../sprint-01-core/task-01-onboarding.md)), o que não escala — o time que vai de fato atender os clientes da consultoria precisa de contas próprias, com permissões proporcionais ao cargo. Introduz dois novos cargos de staff (`manager` e `consultant`) numa hierarquia simples: cada cargo só pode criar e desativar cargos abaixo dele, e herda tudo que os cargos abaixo podem fazer.

Módulo de domínio: **Core** (ver [`../../docs/domain-model.md`](../../docs/domain-model.md#hierarquia-de-administradores-staff)).

Não depende de nenhuma sprint futura (Cardápio Digital, PDV) — pode ser feita a qualquer momento, mas faz mais sentido antes de operar com clientes reais, já que hoje só existe uma conta (`super_admin`) capaz de criar tenants.

## Regras de negócio

```
SUPER_ADMIN  →  cria/desativa MANAGER
   MANAGER   →  cria/desativa CONSULTANT  (+ tudo que CONSULTANT faz)
      CONSULTANT → cria tenants/owners (signup) e gerencia módulos de qualquer tenant
```

- Um cargo só gerencia (cria/desativa) cargos estritamente abaixo dele — `consultant` não gerencia ninguém; `manager` só gerencia `consultant`; `super_admin` só gerencia `manager` diretamente (mas, por herança, também pode agir como manager/consultant).
- Ninguém desativa a própria conta nem uma conta de cargo igual ou maior.
- Desativar é reversível (campo `active`), diferente do soft-delete que já existe (`deletedAt`, usado hoje em `DELETE /v1/accounts/:id`).
- Conta desativada não consegue fazer login.

## Tarefas

| Tarefa | Descrição | Status |
|---|---|---|
| [`task-01-cargos-e-hierarquia`](./task-01-cargos-e-hierarquia.md) | Roles `manager`/`consultant`, criação em cascata, campo `active` | Não iniciada |
| [`task-02-desativar-staff`](./task-02-desativar-staff.md) | Desativar conta de cargo inferior, bloqueio de login | Não iniciada |
| [`task-03-modulos-por-qualquer-tenant`](./task-03-modulos-por-qualquer-tenant.md) | Consultor/manager gerenciam módulos de qualquer tenant, não só o próprio | Não iniciada |

## Cortes de escopo (já previstos)

- Reativar uma conta desativada — não foi pedido, só desativação.
- Log de auditoria de quem desativou quem — vale a pena, mas é um follow-up, não bloqueia esta sprint.
- Transferir/reatribuir tenants entre consultores — não existe "dono" de tenant do lado do staff, qualquer consultant/manager/super pode atender qualquer tenant.
