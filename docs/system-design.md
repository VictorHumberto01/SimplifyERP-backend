# System Design

## Fluxo de dados ponta a ponta

Exemplo canônico do MVP — um cliente sentado à mesa faz um pedido pelo Cardápio Digital e o PDV fecha a conta:

1. **Cliente escaneia o QR Code da mesa** → abre o Cardápio Digital (frontend Next.js), que consome a API do módulo `Cardápio Digital`.
2. **Cliente monta o pedido e envia** → o módulo `Cardápio Digital` grava o pedido no PostgreSQL, associado ao estabelecimento e à mesa (multi-tenant, ver abaixo).
3. **Pedido aparece em tempo real no painel da loja** → como Cardápio Digital e PDV compartilham o mesmo banco (integração nativa do Monolito Modular), o PDV lê o pedido assim que ele é persistido, sem necessidade de sincronização entre serviços.
4. **Operador do PDV lança itens extras, aplica desconto e fecha a comanda** → o módulo `PDV` atualiza o estado do pedido/comanda e registra o pagamento.
5. **Eventos assíncronos** (ex.: notificação de "pedido pronto", e futuramente emissão fiscal) são despachados como **jobs no BullMQ**, processados por workers sem bloquear a resposta da API.

## Papel de cada peça de infraestrutura

| Componente | Papel |
|---|---|
| **PostgreSQL** | Fonte única da verdade. Armazena dados transacionais de todos os módulos (Core, Cardápio Digital, PDV, ...), com isolamento lógico por `tenant`/estabelecimento. |
| **Redis** | Cache de leitura (ex.: cardápio publicado, configurações do estabelecimento), armazenamento de sessão e rate limiting da API. Também serve como broker de filas para o BullMQ. |
| **BullMQ** | Processamento assíncrono de jobs que não podem bloquear a resposta HTTP: notificações, e futuramente emissão de NFC-e/NF-e (módulo Fiscal), geração de relatórios pesados. |
| **Fastify** | Camada HTTP: roteamento, validação de schema, autenticação, e ponto de entrada para os módulos de aplicação (camada `application` de cada Bounded Context). |

## Requisitos não-funcionais

- **Time-to-value < 30 minutos**: da criação da conta até o primeiro pedido no Cardápio Digital, sem intervenção manual — onboarding self-service, sem taxa de implantação nem visita técnica.
- **Multi-tenant**: cada estabelecimento (`tenant`) tem seus dados logicamente isolados dentro do banco compartilhado; toda query de módulo de negócio é escopada por `tenant_id`.
- **Tempo real entre módulos**: por compartilharem o mesmo banco de dados, não há delay de sincronização entre Cardápio Digital, PDV e (futuramente) Estoque — a leitura é sempre consistente no momento da escrita.
- **Extensibilidade sem custo de infra**: novos módulos (Estoque, Financeiro, Fiscal) devem poder ser "ligados" para um tenant sem provisionar novos serviços — apenas habilitando o módulo dentro do monolito.

## Autenticação e autorização (alto nível)

O módulo `Core` é responsável por:

- Autenticação de usuários (dono do estabelecimento, operadores de caixa) via JWT.
- Controle de acesso por papel (role) dentro de cada estabelecimento (ex.: dono vs. operador de PDV).
- Gestão do tenant/estabelecimento e dos módulos habilitados para ele — a "chave" que liga/desliga o acesso funcional a Cardápio Digital, PDV e módulos futuros.

Detalhes de implementação (estratégia de hashing, refresh tokens, etc.) serão definidos junto com o código do módulo Core.

## Documentos relacionados

- [`architecture.md`](./architecture.md) — visão geral do Monolito Modular.
- [`domain-model.md`](./domain-model.md) — modelagem DDD tática por módulo.
