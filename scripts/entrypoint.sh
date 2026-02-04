#!/bin/bash
set -e

echo "🔍 Testing PostgreSQL via DATABASE_URL"

psql "$DATABASE_URL" -c "SELECT current_database(), inet_server_addr();"

echo "✅ Connection OK"
