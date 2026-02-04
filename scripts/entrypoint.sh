#!/bin/bash
set -e

echo "Starting Education Service Monolith entrypoint..."

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Service is not connected to PostgreSQL."
  exit 1
fi

PARSED_HOST=$(echo $DATABASE_URL | sed -E 's|.*@([^:/]+).*|\1|')
PARSED_PORT=$(echo $DATABASE_URL | sed -E 's|.*:([0-9]+)/.*|\1|')
PARSED_USER=$(echo $DATABASE_URL | sed -E 's|.*://([^:]+):.*|\1|')
PARSED_PASS=$(echo $DATABASE_URL | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
PARSED_DB=$(echo $DATABASE_URL | sed -E 's|.*/([^?]+).*|\1|')

ADMIN_URL="postgresql://${PARSED_USER}:${PARSED_PASS}@${PARSED_HOST}:${PARSED_PORT}/postgres"

echo "Waiting for PostgreSQL at ${PARSED_HOST}:${PARSED_PORT}..."
until psql "$ADMIN_URL" -c "SELECT 1" >/dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up and reachable."

echo "Checking if database '${PARSED_DB}' exists..."
DB_EXISTS=$(psql "$ADMIN_URL" -tAc "SELECT 1 FROM pg_database WHERE datname='${PARSED_DB}'")

if [ "$DB_EXISTS" != "1" ]; then
  echo "Database '${PARSED_DB}' does not exist. Creating..."
  psql "$ADMIN_URL" -c "CREATE DATABASE \"${PARSED_DB}\""
  echo "Database '${PARSED_DB}' created successfully."
else
  echo "Database '${PARSED_DB}' already exists."
fi

echo "Creating schemas if they do not exist..."
psql "$DATABASE_URL" <<EOF
CREATE SCHEMA IF NOT EXISTS gateway;
CREATE SCHEMA IF NOT EXISTS education;
CREATE SCHEMA IF NOT EXISTS ratings;
CREATE SCHEMA IF NOT EXISTS forum;
CREATE SCHEMA IF NOT EXISTS newsletter;
EOF
echo "Schemas initialized successfully."

echo "Starting Java application..."
exec java -Dserver.port="${PORT:-8080}" -jar /app/app.jar
