FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY . .

RUN mvn -pl apiKeygateway -am clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

ARG JAR_FILE=/build/apiKeygateway/target/apiKeygateway-1.0.0-SNAPSHOT.jar
COPY --from=build ${JAR_FILE} app.jar

RUN java -jar app.jar --version 2>/dev/null || echo "JAR verification skipped"

COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/entrypoint.sh

ENV SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
