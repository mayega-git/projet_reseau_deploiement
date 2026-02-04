#!/bin/bash
set -e

echo "🔍 Testing PostgreSQL connection with Railway env vars"
echo "-----------------------------------------------"
echo "Host      : $PGHOST"
echo "Port      : $PGPORT"
echo "User      : $PGUSER"
echo "Database  : $PGDATABASE"
echo "-----------------------------------------------"

echo "⏳ Attempting connection..."

PGPASSWORD="$PGPASSWORD" psql \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -U "$PGUSER" \
  -d "$PGDATABASE" \
  -c "SELECT version();"

echo "✅ PostgreSQL connection SUCCESS"
