#!/usr/bin/env bash
# Faz backup lógico (pg_dump, formato custom) do banco do serviço "postgres" do
# Compose e aplica retenção. Não requer acesso direto ao host do banco: passa
# pelo `docker compose exec`, então funciona igual em dev, homologação e produção.
#
# Uso:
#   ./scripts/db/backup.sh [--retention-days N] [--out-dir DIR]
#
# Variáveis de ambiente (lidas do .env do diretório atual se não exportadas antes):
#   POSTGRES_USER, POSTGRES_DB — credenciais do banco (obrigatórias)
#   COMPOSE_FILE_ARGS          — argumentos extras de -f para o docker compose (opcional)

set -euo pipefail

RETENTION_DAYS=14
OUT_DIR="./backups"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --retention-days) RETENTION_DAYS="$2"; shift 2 ;;
    --out-dir) OUT_DIR="$2"; shift 2 ;;
    *) echo "Argumento desconhecido: $1" >&2; exit 1 ;;
  esac
done

if [[ -f .env ]]; then
  # shellcheck disable=SC1091
  set -a; source .env; set +a
fi

: "${POSTGRES_USER:?POSTGRES_USER não definido (verifique o .env)}"
: "${POSTGRES_DB:?POSTGRES_DB não definido (verifique o .env)}"

mkdir -p "$OUT_DIR"
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
dump_file="$OUT_DIR/${POSTGRES_DB}_${timestamp}.dump"

echo "Gerando backup de '$POSTGRES_DB' em $dump_file ..."
# shellcheck disable=SC2086
docker compose ${COMPOSE_FILE_ARGS:-} exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -F c -d "$POSTGRES_DB" > "$dump_file"

if [[ ! -s "$dump_file" ]]; then
  echo "Backup vazio ou falhou; removendo arquivo incompleto." >&2
  rm -f "$dump_file"
  exit 1
fi

echo "Backup concluído: $dump_file ($(du -h "$dump_file" | cut -f1))"

echo "Aplicando retenção de $RETENTION_DAYS dias em $OUT_DIR ..."
find "$OUT_DIR" -name "${POSTGRES_DB}_*.dump" -mtime "+$RETENTION_DAYS" -print -delete

echo "OK."
