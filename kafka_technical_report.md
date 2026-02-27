# Rapport Technique : Migration et Infrastructure Kafka sur Railway

## 1. Introduction à Apache Kafka

Apache Kafka est une plateforme de streaming d'événements distribuée, conçue initialement par LinkedIn avant de devenir un projet open-source majeur de la fondation Apache. Contrairement aux files d'attente de messages traditionnelles qui suppriment les messages une fois consommés, Kafka fonctionne comme un journal de commit distribué. Les données y sont écrites de manière séquentielle sur le disque et répliquées à travers plusieurs nœuds, ou "brokers", garantissant ainsi une persistance, une tolérance aux pannes et un débit extrêmement élevé.

Le fonctionnement de Kafka repose sur des concepts clés interconnectés :
*   **Topics** : Catégories ou flux de données (ex: `newsletter.updates`).
*   **Partitions** : Subdivisions d'un topic permettant le parallélisme.
*   **Consumer Groups** : Mécanisme permettant à plusieurs instances de consommateurs de se coordonner pour lire des partitions uniques.

Cette architecture confère à Kafka une robustesse exceptionnelle, le rendant capable de gérer des millions de messages par seconde avec une latence minimale.

## 2. Analyse de l'Architecture Héritée : Consommateurs Dynamiques

Dans la version précédente de votre service Newsletter, l'architecture reposait sur une création dynamique et granulaire des consommateurs Kafka. Pour chaque catégorie de newsletter ou pour chaque utilisateur, le code générait un nouveau "Consumer Group" dédié (par exemple, `group_finance`, `group_sport`).

**Problèmes Rencontrés :**
*   **Explosion des Threads** : Chaque Consumer Group nécessite des threads et des connexions TCP actives. Avec des dizaines de groupes, la JVM sature.
*   **Saturation Mémoire (OOM)** : Sur un environnement contraint comme Railway (512Mo RAM), maintenir autant de connexions provoque des crashs "Out Of Memory".
*   **Complexité** : La gestion du cycle de vie des listeners (création/suppression dynamique) est source de bugs et de race conditions.

## 3. Nouvelle Architecture Centralisée : Single Consumer Group

La nouvelle architecture inverse cette logique : **Un seul Consumer Group pour tout le trafic**.

### Implémentation Concrète

Nous avons configuré un consommateur unique `newsletter-email-service` qui écoute le topic global `newsletter.updates`.

**Configuration Centralisée (`KafkaConfig.java`) :**
Nous avons réduit la concurrence à `1` pour minimiser l'empreinte mémoire.
```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, NewsletterPublishedEvent> kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, NewsletterPublishedEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory());
    factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
    
    // OPTIMISATION CRITIQUE : Concurrence réduite à 1 pour économiser la RAM
    factory.setConcurrency(1);
    
    return factory;
}
```

**Logique de Consommation (`KafkaConsumerService.java`) :**
Le routage intelligent se fait désormais au niveau applicatif (Java/SQL) et non plus au niveau infrastructure (Kafka).
```java
@KafkaListener(topics = "newsletter.updates", groupId = "newsletter-email-service", containerFactory = "kafkaListenerContainerFactory")
public void consumeNewsletterEvent(ConsumerRecord<String, NewsletterPublishedEvent> record, Acknowledgment acknowledgment) {
    NewsletterPublishedEvent event = record.value();
    
    // Traitement : Récupération des abonnés via SQL et envoi d'emails
    processNewsletter(event)
        .doOnSuccess(emailsSent -> acknowledgment.acknowledge()) // Ack manuel uniquement si succès
        .subscribe();
}
```

**Requête SQL Native (`LecteurRepository.java`) :**
Au lieu d'avoir un consommateur par catégorie, nous utilisons une seule requête efficace pour trouver les destinataires via la table de jointure.

```java
@Query("SELECT DISTINCT l.* FROM lecteur l " +
       "JOIN lecteur_categorie_abonnement a ON l.id = a.lecteur_id " +
       "WHERE a.categorie_id IN (:categoryIds)")
Flux<Lecteur> findDistinctByCategoriesIn(java.util.List<UUID> categoryIds);
```

**Avantages :**
*   **Mémoire Constante** : Peu importe le nombre de catégories, il n'y a qu'une seule connexion Kafka.
*   **Simplicité** : Plus de logique dynamique complexe.
*   **Robustesse** : Le traitement est séquentiel et contrôlé.

## 4. Défis de Déploiement Kafka sur Railway et Résolutions

Le déploiement sur Railway a nécessité deux ajustements majeurs pour la stabilité.

### A. Le Problème des "Advertised Listeners" (Réseau)
Kafka doit être accessible à la fois par lui-même (trafic interne) et par les autres services (trafic inter-conteneurs). Une mauvaise configuration entraîne des erreurs de connexion silencieuses ou des crashs.

**Solution Concrète (`docker-compose.yml` / Variables Railway) :**
Il faut configurer une double écoute (Dual Listeners) :
1.  `INTERNAL` : Pour que le broker se parle à lui-même sur `localhost`.
2.  `PLAINTEXT` : Pour que les autres services (Spring Boot) lui parlent via le DNS Railway.

```yaml
environment:
  # Écoute sur toutes les interfaces pour les deux protocoles
  KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,INTERNAL://0.0.0.0:29092
  
  # Annonce des adresses différentes selon le réseau
  # - PLAINTEXT : Accessible via le DNS interne Railway pour les apps
  # - INTERNAL : Accessible via localhost pour le broker lui-même
  KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://zooming-flow.railway.internal:9092,INTERNAL://localhost:29092
  
  KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT
  KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
```

### B. La Gestion de la Mémoire (OOM Kills)
Sans limite explicite, Java tente d'utiliser toute la RAM disponible, ce qui dépasse la limite du conteneur Docker Railway et provoque un arrêt brutal (Kill).

**Solution Concrète :**
Forcer les options de la JVM via la variable d'environnement `KAFKA_HEAP_OPTS`.

| Variable | Valeur | Description |
| :--- | :--- | :--- |
| `KAFKA_HEAP_OPTS` | `-Xmx400m -Xms400m` | Limite strictement Kafka à 400Mo de RAM, laissant 100Mo pour l'OS du conteneur (sur un plan 512Mo). |

Cette configuration a permis de stabiliser définitivement le service.
