#!/usr/bin/env bash
# Restaura um dump gerado por backup.sh no serviço "postgres" do Compose.
# Usa --clean --if-exists: derruba os objetos existentes antes de recriar,
# então o banco de destino fica idêntico ao dump (não faz merge).
#
# Uso:
#   ./scripts/db/restore.sh path/para/arquivo.dump

set -euo pipefail

DUMP_FILE="${1:?Uso: ./scripts/db/restore.sh path/para/arquivo.dump}"

if [[ ! -f "$DUMP_FILE" ]]; then
  echo "Arquivo de backup não encontrado: $DUMP_FILE" >&2
  exit 1
fi

if [[ -f .env ]]; then
  # shellcheck disable=SC1091
  set -a; source .env; set +a
fi

: "${POSTGRES_USER:?POSTGRES_USER não definido (verifique o .env)}"
: "${POSTGRES_DB:?POSTGRES_DB não definido (verifique o .env)}"

echo "Restaurando $DUMP_FILE em '$POSTGRES_DB'. Isso substitui os dados atuais."
read -r -p "Confirma? (digite o nome do banco '$POSTGRES_DB' para continuar) " confirmation
if [[ "$confirmation" != "$POSTGRES_DB" ]]; then
  echo "Confirmação não corresponde ao nome do banco. Abortando." >&2
  exit 1
fi

# shellcheck disable=SC2086
docker compose ${COMPOSE_FILE_ARGS:-} exec -T postgres \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < "$DUMP_FILE"

echo "Restauração concluída. Verifique a integridade dos dados antes de liberar o ambiente."
