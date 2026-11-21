#!/usr/bin/env bash
# Runs every migration against a throwaway local Postgres 16 (with a stub of Supabase's auth/storage schemas)
# and then checks the access rules for each role. Prints PASS/FAIL per rule; exits non-zero on any FAIL.
# Needs: Postgres 16 binaries (initdb, pg_ctl, psql). Usage: bash supabase/tests/run.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
DIR="$(mktemp -d)"
PORT="${PG_PORT:-55433}"
trap '"$BIN/pg_ctl" -D "$DIR/data" stop -m immediate >/dev/null 2>&1 || true; rm -rf "$DIR"' EXIT
"$BIN/initdb" -D "$DIR/data" -A trust -U postgres >/dev/null
"$BIN/pg_ctl" -D "$DIR/data" -o "-p $PORT -k $DIR" -l "$DIR/log" start >/dev/null
sleep 1
run() { psql -h "$DIR" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -f "$1"; }
run "$ROOT/supabase/tests/00_supabase_stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do run "$f"; done
OUT="$(psql -h "$DIR" -p "$PORT" -U postgres -d postgres -q -f "$ROOT/supabase/tests/10_access_rules.sql" 2>&1 | grep -E 'PASS|FAIL|ERROR' | sed 's/^.*NOTICE:  //')"
echo "$OUT"
! grep -qE 'FAIL|ERROR' <<<"$OUT"
