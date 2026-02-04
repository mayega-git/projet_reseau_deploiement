#!/bin/bash
set -e

echo "Starting Education Service Monolith entrypoint..."

# Railway requirement
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set. Service is not connected to PostgreSQL."
  exit 1
fi

echo "🔍 Verifying PostgreSQL connection..."
echo "DATABASE_URL detected"

# Wait for PostgreSQL to be ready
until psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is up and reachable."

echo "Starting Java application..."

exec java -Dserver.port="${PORT:-8080}" -jar /app/app.jar

