# Módulos

O SimplifyERP é vendido e usado sob a filosofia de **crescimento sob demanda**: o cliente liga e desliga módulos conforme o negócio cresce, e só visualiza — e só paga por — a complexidade que realmente precisa naquele momento.

## Escopo do MVP (para começar a operar)

### 1. Core do Sistema

Base estrutural que sustenta o monolito modular: autenticação segura, gestão de usuários e configurações do estabelecimento. Todo módulo de negócio depende do Core para saber "quem" está operando e "quais módulos" aquele estabelecimento tem habilitados.

### 2. Cardápio Digital

Atendimento nas mesas via QR Code: o cliente acessa o cardápio pelo celular, monta o pedido, e ele cai diretamente no painel da loja — sem intervenção manual do estabelecimento.

### 3. Frente de Caixa (PDV)

Interface ágil de balcão para lançar itens, registrar vendas rápidas, aplicar descontos e fechar comandas e pagamentos.

## Módulos futuros (pós-MVP para expansão do negócio)

### Estoque & Insumos

Baixa automática de ingredientes usando ficha técnica, alertas de estoque mínimo e análise de curva ABC para compras inteligentes.

### Gestão Financeira

Controle de contas a pagar/receber, fluxo de caixa diário, conciliação de cartões e DRE simplificado para ajudar o dono na tomada de decisão.

### Fiscal e Relatórios

Emissão automatizada de notas fiscais (NFC-e/NF-e) integrada à venda, além de painéis com gráficos de desempenho, ticket médio e produtos mais vendidos.

## Documentos relacionados

- [`domain-model.md`](./domain-model.md) — modelagem DDD tática de cada módulo.
- [`roadmap.md`](./roadmap.md) — ordem e fases de desenvolvimento.
