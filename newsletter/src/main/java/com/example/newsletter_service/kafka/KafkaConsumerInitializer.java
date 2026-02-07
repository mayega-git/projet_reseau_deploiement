package com.example.newsletter_service.kafka;

import com.example.newsletter_service.services.ConsumerGroupManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Initialise les consumer groups Kafka au démarrage de l'application.
 * Recrée tous les listeners pour les lecteurs existants qui ont des
 * abonnements.
 */
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Component
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConsumerInitializer {

    private final ConsumerGroupManager consumerGroupManager;
    private final KafkaDynamicListenerManager dynamicListenerManager;

    private final org.springframework.kafka.core.KafkaAdmin kafkaAdmin;

    /**
     * Appelé automatiquement quand l'application est prête.
     * Recrée tous les consumer groups pour les combinaisons de catégories
     * existantes.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void initializeConsumerGroups() {
        log.info("🚀 Démarrage de l'initialisation Kafka...");

        // 1. AUTO-FIX: Vérifier et corriger les topics cassés (RF > 1)
        checkAndFixTopics();

        log.info(" Initialisation des consumer groups Kafka au démarrage...");

        consumerGroupManager.initializeAllConsumerGroups()
                .doOnNext(tuple -> {
                    String groupId = tuple.getT1();
                    String[] topics = tuple.getT2().toArray(new String[0]);

                    if (topics.length > 0) {
                        dynamicListenerManager.createOrGetListener(groupId, topics);
                        log.info(" Consumer group '{}' initialisé - Topics: {}",
                                groupId, String.join(", ", topics));
                    }
                })
                .doOnComplete(() -> log.info(" Tous les consumer groups ont été initialisés avec succès"))
                .doOnError(e -> log.error(" Erreur lors de l'initialisation des consumer groups: {}", e.getMessage()))
                .onErrorResume(e -> Mono.empty())
                .subscribe();
    }

    /**
     * Vérifie si des topics 'newsletter.*' ont un Replication Factor > 1
     * et les supprime si c'est le cas pour forcer une recréation propre.
     */
    private void checkAndFixTopics() {
        try (org.apache.kafka.clients.admin.AdminClient client = org.apache.kafka.clients.admin.AdminClient
                .create(kafkaAdmin.getConfigurationProperties())) {
            log.info("🕵️ Vérification des topics Kafka et prise de mesures correctives...");

            // Lister tous les topics
            java.util.Set<String> topics = client.listTopics().names().get();
            java.util.List<String> newsletterTopics = topics.stream()
                    .filter(t -> t.startsWith("newsletter."))
                    .collect(java.util.stream.Collectors.toList());

            if (newsletterTopics.isEmpty()) {
                log.info("✅ Aucun topic newsletter trouvé, tout est propre.");
                return;
            }

            // Décrire pour voir le RF
            java.util.Map<String, org.apache.kafka.clients.admin.TopicDescription> descriptions = client
                    .describeTopics(newsletterTopics).all().get();

            java.util.List<String> topicsToDelete = new java.util.ArrayList<>();

            for (java.util.Map.Entry<String, org.apache.kafka.clients.admin.TopicDescription> entry : descriptions
                    .entrySet()) {
                String name = entry.getKey();
                org.apache.kafka.clients.admin.TopicDescription desc = entry.getValue();

                // Si partitions > 0 et replicas > 1 => PROBLÈME sur un single node
                if (!desc.partitions().isEmpty()) {
                    int rf = desc.partitions().get(0).replicas().size();
                    if (rf > 1) {
                        log.warn("⚠️ Topic '{}' a un Replication Factor de {}. Suppression forcée...", name, rf);
                        topicsToDelete.add(name);
                    }
                }
            }

            if (!topicsToDelete.isEmpty()) {
                client.deleteTopics(topicsToDelete).all().get();
                log.info("✅ {} topics supprimés ({}). Ils seront recréés avec le bon RF au prochain usage.",
                        topicsToDelete.size(), String.join(", ", topicsToDelete));
                // Pause pour propagation
                Thread.sleep(2000);
            } else {
                log.info("✅ Tous les topics newsletter sont corrects (RF=1).");
            }

        } catch (Exception e) {
            log.error("❌ Erreur lors de l'auto-fix des topics: {}", e.getMessage());
        }
    }
}
