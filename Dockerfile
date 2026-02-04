# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

# Copy the entire project for multi-module build
COPY . .

# Build only the necessary module and its dependencies
RUN mvn -pl apiKeygateway -am clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install postgresql-client for the init script
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy the JAR from the build stage
COPY --from=build /build/apiKeygateway/target/apiKeygateway-1.0.0-SNAPSHOT.jar app.jar

# Copy initialization scripts
COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/entrypoint.sh

# Environment variable defaults
ENV SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
