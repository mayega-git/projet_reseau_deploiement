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

    /**
     * Appelé automatiquement quand l'application est prête.
     * Recrée tous les consumer groups pour les combinaisons de catégories
     * existantes.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void initializeConsumerGroups() {
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
}
