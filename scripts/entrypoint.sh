#!/bin/bash
set -e

# Defaults for Railway
DB_HOST=${PGHOST:-localhost}
DB_PORT=${PGPORT:-5432}
DB_USER=${PGUSER:-postgres}
DB_PASS=${PGPASSWORD:-adminuser}
DB_NAME=${PGDATABASE:-railway}

echo "Starting Education Service Monolith entrypoint..."

# Function to create database if it doesn't exist
create_db_if_not_exists() {
    local dbname=$1
    echo "Checking if database '$dbname' exists..."
    
    # Check if DB exists
    DB_EXISTS=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT 1 FROM pg_database WHERE datname='$dbname'")
    
    if [ "$DB_EXISTS" != "1" ]; then
        echo "Database '$dbname' does not exist. Creating..."
        PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE DATABASE \"$dbname\""
        echo "Database '$dbname' created successfully."
    else
        echo "Database '$dbname' already exists."
    fi
}

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
until PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c '\q' > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up."

# List of databases to create
databases=("apikeygateway" "newsletter" "education-service" "review-service" "forum_new")

for db in "${databases[@]}"; do
    create_db_if_not_exists "$db"
done

echo "Database initialization complete. Starting application..."

# Start the Java application
exec java -Dserver.port=$PORT -jar /app/app.jar
