# Task 02 — Acesso via QR Code

**Sprint**: sprint-02-cardapio-digital
**Módulo(s)**: Cardápio Digital

## Objetivo

O cliente escaneia o QR Code da mesa e acessa o cardápio publicado, sem precisar de login.

## Backend

- [ ] Entidade `Table` e value object `QrCodeToken` (token único por mesa/estabelecimento)
- [ ] Endpoint público `GET /public/menu/:qrCodeToken`: retorna o cardápio publicado do estabelecimento correspondente
- [ ] Geração/consulta do QR Code por mesa (endpoint interno para o dono gerar/baixar o código)

## Frontend

- [ ] Página pública `/cardapio/[mesa]` (ou `/c/[qrCodeToken]`), sem exigir autenticação
- [ ] Tela interna para o dono visualizar/baixar o QR Code de cada mesa

## Definition of Done

- [ ] Escanear o QR Code de uma mesa abre o cardápio correto daquele estabelecimento, em menos de 30 minutos após o cadastro do cardápio
- [ ] Acesso à página pública não exige login
