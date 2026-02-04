# 📚 Guide de Migration vers Monolithe - Education Service

> **Date de création**: 25 janvier 2026  
> **Version**: 1.0.0  
> **Auteur**: Assistant IA

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture finale](#architecture-finale)
3. [Prérequis](#prérequis)
4. [Modifications effectuées](#modifications-effectuées)
   - [Structure Maven](#1-structure-maven)
   - [Configuration de l'application principale](#2-configuration-de-lapplication-principale)
   - [Gestion des conflits de beans](#3-gestion-des-conflits-de-beans)
   - [Configuration YAML consolidée](#4-configuration-yaml-consolidée)
   - [Désactivation des modules enfants](#5-désactivation-des-modules-enfants)
5. [Guide d'intégration d'un nouveau module](#guide-dintégration-dun-nouveau-module)
6. [Problèmes courants et solutions](#problèmes-courants-et-solutions)
7. [Commandes utiles](#commandes-utiles)
8. [Checklist d'intégration](#checklist-dintégration)

---

## Vue d'ensemble

Ce document décrit la transformation de 3 microservices Spring Boot indépendants en un monolithe unifié :

| Module            | Package de base                       | Rôle                                                                           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| **apiKeygateway** | `com.education_service.apiKeygateway` | Service principal (point d'entrée), gestion des clés API, authentification JWT |
| **newsletter**    | `com.example.newsletter_service`      | Gestion des newsletters, envoi d'emails, Kafka                                 |
| **education**     | `com.letsgo.education_service`        | Gestion du contenu éducatif (podcasts, blogs, catégories)                      |

### Pourquoi cette migration ?

- Simplification du déploiement
- Réduction de la complexité opérationnelle
- Communication inter-modules plus efficace (pas de réseau)
- Transactions distribuées simplifiées

---

## Architecture finale

```
education-service/
├── pom.xml                          # POM parent (packaging: pom)
├── apiKeygateway/                   # MODULE PRINCIPAL (point d'entrée)
│   ├── pom.xml                      # Dépend de newsletter et education
│   └── src/main/
│       ├── java/.../ApiKeygatewayApplication.java   # Main class
│       └── resources/application.yaml               # Config consolidée
├── newsletter/                      # Module dépendance (JAR library)
│   ├── pom.xml
│   └── src/main/java/...
└── education/                       # Module dépendance (JAR library)
    ├── pom.xml
    └── src/main/java/...
```

### Flux de dépendances

```
apiKeygateway (MAIN)
    ├── depends on → newsletter (JAR)
    └── depends on → education (JAR)
```

---

## Prérequis

### Versions requises

- **Java**: 21
- **Spring Boot**: 3.5.9
- **Maven**: 3.8+
- **PostgreSQL**: 13+

### Infrastructure

- PostgreSQL sur `localhost:5433` avec les bases :
  - `apikeygateway`
  - `newsletter`
  - `education-service`
- Kafka sur `localhost:9092` (pour le module newsletter)

---

## Modifications effectuées

### 1. Structure Maven

#### 1.1 POM Parent (`/pom.xml`)

Le POM parent doit définir les modules enfants :

```xml
<project>
    <groupId>com.education-service</groupId>
    <artifactId>education-service-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>newsletter</module>
        <module>education</module>
        <module>apiKeygateway</module>
    </modules>

    <!-- Properties communes -->
    <properties>
        <java.version>21</java.version>
        <spring-boot.version>3.5.9</spring-boot.version>
        <!-- ... -->
    </properties>
</project>
```

#### 1.2 POM du module principal (`/apiKeygateway/pom.xml`)

**Ajout des dépendances vers les modules enfants :**

```xml
<dependencies>
    <!-- Modules internes -->
    <dependency>
        <groupId>com.education-service</groupId>
        <artifactId>newsletter</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </dependency>
    <dependency>
        <groupId>com.education-service</groupId>
        <artifactId>education</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </dependency>

    <!-- Autres dépendances... -->
</dependencies>
```

#### 1.3 Synchronisation des versions

**⚠️ IMPORTANT**: Toutes les versions des modules doivent être synchronisées.

**Fichier**: `/education/pom.xml`

```xml
<!-- AVANT -->
<version>0.0.1-SNAPSHOT</version>

<!-- APRÈS -->
<version>1.0.0-SNAPSHOT</version>
```

---

### 2. Configuration de l'application principale

#### 2.1 Fichier: `/apiKeygateway/src/main/java/.../ApiKeygatewayApplication.java`

```java
package com.education_service.apiKeygateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication(
    // 1️⃣ Scanner TOUS les packages des modules
    scanBasePackages = {
        "com.education_service.apiKeygateway",
        "com.example.newsletter_service",
        "com.letsgo.education_service"
    },
    // 2️⃣ Exclure Liquibase auto-config pour éviter les conflits de changelog
    exclude = {
        org.springframework.boot.autoconfigure.liquibase.LiquibaseAutoConfiguration.class
    }
)
// 3️⃣ Activer R2DBC pour TOUS les repositories de tous les modules
@EnableR2dbcRepositories(basePackages = {
    "com.education_service.apiKeygateway.repository",
    "com.example.newsletter_service.repositories",
    "com.letsgo.education_service.repository"
})
// 4️⃣ Activer les fonctionnalités utilisées par les modules
@EnableKafka      // Utilisé par newsletter
@EnableAsync      // Utilisé par newsletter
@EnableScheduling // Utilisé par education
public class ApiKeygatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiKeygatewayApplication.class, args);
        System.out.println("✅ Monolithe Education Service démarré avec succès !");
    }
}
```

#### 2.2 Explication des annotations

| Annotation                               | Pourquoi                                                    |
| ---------------------------------------- | ----------------------------------------------------------- |
| `scanBasePackages`                       | Permet à Spring de découvrir les beans de TOUS les modules  |
| `exclude = {LiquibaseAutoConfiguration}` | Évite que Spring cherche un changelog par défaut inexistant |
| `@EnableR2dbcRepositories`               | Active les repositories R2DBC pour tous les packages        |
| `@EnableKafka`                           | Requis par le module newsletter pour les listeners Kafka    |
| `@EnableAsync`                           | Requis par newsletter pour l'envoi d'emails asynchrone      |
| `@EnableScheduling`                      | Requis par education pour les tâches planifiées             |

---

### 3. Gestion des conflits de beans

Lors de la fusion de modules, des conflits de noms de beans peuvent survenir.

#### 3.1 Activation du bean overriding

**Fichier**: `/apiKeygateway/src/main/resources/application.yaml`

```yaml
spring:
  main:
    allow-bean-definition-overriding: true
```

#### 3.2 Renommage des classes en conflit

**Problème**: Plusieurs modules ont des classes avec le même nom.

**Solution**: Renommer les classes pour qu'elles soient uniques.

| Conflit                  | Module     | Action                                             |
| ------------------------ | ---------- | -------------------------------------------------- |
| `SecurityConfig`         | education  | Renommer → `SecurityConfig.java.bak` (désactiver)  |
| `SwaggerConfig`          | education  | Renommer → `EducationSwaggerConfig.java`           |
| `SwaggerConfig`          | newsletter | Renommer → `NewsletterSwaggerConfig.java`          |
| `R2dbcConfig`            | newsletter | Renommer → `NewsletterR2dbcConfig.java`            |
| `GlobalExceptionHandler` | education  | Renommer → `EducationGlobalExceptionHandler.java`  |
| `GlobalExceptionHandler` | newsletter | Renommer → `NewsletterGlobalExceptionHandler.java` |

**⚠️ IMPORTANT**: Après renommage, mettre à jour le nom du constructeur :

```java
// AVANT
public class R2dbcConfig {
    public R2dbcConfig(ConnectionFactory cf) { ... }
}

// APRÈS
public class NewsletterR2dbcConfig {
    public NewsletterR2dbcConfig(ConnectionFactory cf) { ... }  // ← Constructeur renommé
}
```

#### 3.3 Résolution des conflits OpenAPI

Si plusieurs beans `OpenAPI` existent, marquer un seul comme `@Primary` :

```java
// Fichier: EducationSwaggerConfig.java
@Configuration
public class EducationSwaggerConfig {
    @Bean
    @Primary  // ← Marquer comme principal
    public OpenAPI educationOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Education Service Monolith")
                .version("1.0.0"));
    }
}
```

**OU** désactiver complètement la configuration du module secondaire :

```java
// Fichier: NewsletterSwaggerConfig.java
// @Configuration  ← COMMENTÉ
public class NewsletterSwaggerConfig {
    // ...
}
```

---

### 4. Configuration YAML consolidée

Le fichier `application.yaml` du module principal doit contenir TOUTES les configurations.

#### 4.1 Structure du fichier

```yaml
# ========================================
# application.yaml - Configuration Monolithe
# ========================================

server:
  port: 8081

spring:
  # ----------------------------------------
  # CONFIGURATION GÉNÉRALE
  # ----------------------------------------
  application:
    name: education-service-monolith
    ping:
      host: https://gateway.yowyob.com/media-service # Requis par PingAPI

  main:
    allow-bean-definition-overriding: true # Résoudre conflits de beans

  # ----------------------------------------
  # BASE DE DONNÉES R2DBC (par défaut)
  # ----------------------------------------
  r2dbc:
    url: r2dbc:postgresql://localhost:5433/apikeygateway
    username: postgres
    password: adminuser

  # ----------------------------------------
  # MAIL (utilisé par newsletter)
  # ----------------------------------------
  mail:
    host: smtp.gmail.com
    port: 587
    username: votre-email@gmail.com
    password: votre-mot-de-passe-app
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  # ----------------------------------------
  # KAFKA (utilisé par newsletter)
  # ----------------------------------------
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"

  # ----------------------------------------
  # DATASOURCE JDBC (pour Liquibase si activé)
  # ----------------------------------------
  datasource:
    url: jdbc:postgresql://localhost:5433/apikeygateway
    username: postgres
    password: adminuser

  # ----------------------------------------
  # LIQUIBASE (désactivé par défaut)
  # ----------------------------------------
  liquibase:
    enabled: false

# ========================================
# CONFIGURATION SPÉCIFIQUE AUX MODULES
# ========================================

# Module Education
education:
  datasource:
    url: r2dbc:postgresql://localhost:5433/education-service
    username: postgres
    password: adminuser
  liquibase:
    enabled: false

# Module Newsletter
newsletter:
  datasource:
    url: r2dbc:postgresql://localhost:5433/newsletter
    username: postgres
    password: adminuser
  kafka:
    topic-prefix: "news"
    num-partitions: 3

# ========================================
# JWT ET SÉCURITÉ
# ========================================
app:
  secret-key-jwt: votre-clé-secrète-jwt
  expiration-time: 3600
```

#### 4.2 Points critiques

1. **`spring.mail.*`**: Doit être sous le préfixe `spring` (pas `newsletter.mail`)
2. **`spring.kafka.*`**: Doit être sous le préfixe `spring` (pas `newsletter.kafka`)
3. **`spring.application.ping.host`**: Requis par la classe PingAPI du module education

---

### 5. Désactivation des modules enfants

Les classes `Application` des modules enfants ne doivent plus être des points d'entrée.

#### 5.1 Newsletter

**Fichier**: `/newsletter/src/main/java/.../NewsletterApplication.java`

```java
package com.example.newsletter_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;

/*@SpringBootApplication
@EnableKafka
@EnableAsync*/  // ← TOUT COMMENTÉ
public class NewsletterApplication {
    public static void main(String[] args) {
        SpringApplication.run(NewsletterApplication.class, args);
    }
}
```

#### 5.2 Education

**Fichier**: `/education/src/main/java/.../EducationServiceApplication.java`

```java
package com.letsgo.education_service;

// ...

/*@SpringBootApplication
@ComponentScan(basePackages = {"com.letsgo.education_service"})
@EnableR2dbcRepositories(basePackages = "com.letsgo.education_service.repository")
@EnableScheduling*/  // ← TOUT COMMENTÉ
public class EducationServiceApplication {
    // ...
}
```

---

## Guide d'intégration d'un nouveau module

### Étape 1: Préparer le module

1. **Vérifier le `groupId` et `artifactId`**:

   ```xml
   <groupId>com.education-service</groupId>
   <artifactId>nouveau-module</artifactId>
   <version>1.0.0-SNAPSHOT</version>
   ```

2. **Définir le parent**:
   ```xml
   <parent>
       <groupId>com.education-service</groupId>
       <artifactId>education-service-parent</artifactId>
       <version>1.0.0-SNAPSHOT</version>
   </parent>
   ```

### Étape 2: Ajouter au POM parent

**Fichier**: `/pom.xml`

```xml
<modules>
    <module>newsletter</module>
    <module>education</module>
    <module>nouveau-module</module>  <!-- ← AJOUTER -->
    <module>apiKeygateway</module>
</modules>
```

### Étape 3: Ajouter comme dépendance au module principal

**Fichier**: `/apiKeygateway/pom.xml`

```xml
<dependency>
    <groupId>com.education-service</groupId>
    <artifactId>nouveau-module</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

### Étape 4: Mettre à jour l'application principale

**Fichier**: `ApiKeygatewayApplication.java`

```java
@SpringBootApplication(
    scanBasePackages = {
        "com.education_service.apiKeygateway",
        "com.example.newsletter_service",
        "com.letsgo.education_service",
        "com.nouveau_module"  // ← AJOUTER le nouveau package
    },
    exclude = {LiquibaseAutoConfiguration.class}
)
@EnableR2dbcRepositories(basePackages = {
    "com.education_service.apiKeygateway.repository",
    "com.example.newsletter_service.repositories",
    "com.letsgo.education_service.repository",
    "com.nouveau_module.repository"  // ← AJOUTER si le module a des repositories
})
```

### Étape 5: Identifier et résoudre les conflits

Chercher les noms de classes en conflit :

```bash
# Chercher les classes Configuration
grep -r "@Configuration" . --include="*.java" | grep -v target

# Chercher les classes Repository
find . -name "*Repository.java" | grep -v target

# Chercher les classes avec des noms communs
find . -name "SecurityConfig.java" | grep -v target
find . -name "SwaggerConfig.java" | grep -v target
```

**Résoudre chaque conflit par** :

- Renommage de classe (préféré)
- Ajout de `@Primary` sur un bean
- Désactivation de `@Configuration`

### Étape 6: Migrer la configuration

1. Identifier toutes les propriétés utilisées par le module :

   ```bash
   grep -r "@Value" nouveau-module/src --include="*.java"
   ```

2. Ajouter ces propriétés dans `/apiKeygateway/src/main/resources/application.yaml`

3. **Attention aux préfixes** :
   - `spring.*` → Pour les configurations Spring standard
   - `nouveau-module.*` → Pour les configurations personnalisées

### Étape 7: Désactiver le module comme application standalone

Commenter les annotations dans la classe Application du nouveau module.

### Étape 8: Compiler et tester

```bash
# Nettoyer et compiler tout
mvn clean install -DskipTests

# Démarrer le monolithe
mvn spring-boot:run -pl apiKeygateway -DskipTests
```

---

## Problèmes courants et solutions

### 1. `ClassNotFoundException` au démarrage

**Cause**: Les JARs des modules ne sont pas à jour dans le cache Maven.

**Solution**:

```bash
mvn clean install -DskipTests
```

### 2. `Could not resolve placeholder 'xxx'`

**Cause**: Une propriété @Value n'est pas définie dans application.yaml.

**Solution**:

1. Identifier la classe utilisant cette propriété :
   ```bash
   grep -r "xxx" . --include="*.java"
   ```
2. Ajouter la propriété dans `application.yaml`

### 3. `ConflictingBeanDefinitionException`

**Cause**: Deux beans ont le même nom.

**Solution**:

1. Renommer l'une des classes
2. OU activer `spring.main.allow-bean-definition-overriding: true`
3. OU marquer un bean avec `@Primary`

### 4. `Duplicate changelog file`

**Cause**: Liquibase trouve plusieurs fichiers changelog avec le même nom.

**Solutions**:

1. Désactiver Liquibase : `exclude = {LiquibaseAutoConfiguration.class}`
2. OU renommer les fichiers changelog pour qu'ils soient uniques
3. OU utiliser des chemins de changelog distincts

### 5. `Port already in use`

**Cause**: Une instance précédente est encore en cours.

**Solution**:

```bash
# Linux/Mac
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### 6. `NoClassDefFoundError` après hot-reload

**Cause**: Spring DevTools a un problème de classloader.

**Solution**: Redémarrer complètement l'application (Ctrl+C puis relancer).

---

## Commandes utiles

```bash
# Compiler tous les modules
mvn clean install -DskipTests

# Compiler un module spécifique
mvn clean install -pl newsletter -DskipTests

# Démarrer le monolithe
mvn spring-boot:run -pl apiKeygateway -DskipTests

# Démarrer sans DevTools (plus stable)
mvn spring-boot:run -pl apiKeygateway -DskipTests -Dspring-boot.run.fork=false

# Chercher une classe
find . -name "*.java" -exec grep -l "NomClasse" {} \;

# Chercher une propriété
grep -r "nom.propriete" . --include="*.yaml" --include="*.properties"

# Voir les conflits potentiels
grep -r "@Configuration" . --include="*.java" | grep -v target | cut -d: -f1 | xargs -I {} basename {}

# Tuer le processus sur un port
lsof -ti:8081 | xargs kill -9

# Vérifier les beans chargés (dans les logs)
mvn spring-boot:run -pl apiKeygateway -Dlogging.level.org.springframework.beans=DEBUG
```

---

## Checklist d'intégration

Utilisez cette checklist pour chaque nouveau module intégré :

- [ ] **POM Parent**: Module ajouté dans `<modules>`
- [ ] **POM Gateway**: Dépendance ajoutée vers le nouveau module
- [ ] **Versions**: Toutes les versions sont synchronisées (1.0.0-SNAPSHOT)
- [ ] **scanBasePackages**: Package du module ajouté
- [ ] **@EnableR2dbcRepositories**: Package des repositories ajouté (si applicable)
- [ ] **Annotations @Enable\***: Ajoutées si le module utilise Kafka, Async, Scheduling, etc.
- [ ] **Conflits de beans**: Tous les conflits identifiés et résolus
- [ ] **Configuration YAML**: Toutes les propriétés migrées
- [ ] **Application.java du module**: Annotations commentées
- [ ] **Compilation**: `mvn clean install -DskipTests` réussit
- [ ] **Démarrage**: Application démarre sans erreur
- [ ] **Tests manuels**: Les endpoints du nouveau module fonctionnent

---

## Annexe: Structure des packages

### Package apiKeygateway

```
com.education_service.apiKeygateway
├── config/
│   ├── SecurityConfig.java
│   ├── JwtUtils.java
│   └── ...
├── controller/
├── service/
├── repository/
└── ApiKeygatewayApplication.java  ← MAIN CLASS
```

### Package newsletter

```
com.example.newsletter_service
├── config/
│   ├── NewsletterSwaggerConfig.java  ← Renommé
│   ├── NewsletterR2dbcConfig.java    ← Renommé
│   └── ...
├── controllers/
├── services/
├── repositories/  ← Notez le 's' final
├── exception/
│   └── NewsletterGlobalExceptionHandler.java  ← Renommé
└── NewsletterApplication.java  ← ANNOTATIONS COMMENTÉES
```

### Package education

```
com.letsgo.education_service
├── config/
│   ├── EducationSwaggerConfig.java   ← Renommé, @Primary
│   └── PingAPI.java
├── controller/
├── service/
├── repository/  ← Sans 's'
├── exceptions/
│   └── EducationGlobalExceptionHandler.java  ← Renommé
└── EducationServiceApplication.java  ← ANNOTATIONS COMMENTÉES
```

---

> **Note finale**: Ce guide a été créé pour documenter une migration spécifique. Chaque projet peut avoir des particularités nécessitant des adaptations. En cas de doute, privilégiez toujours la lecture des logs d'erreur Spring Boot qui sont généralement très explicites sur la cause des problèmes.
