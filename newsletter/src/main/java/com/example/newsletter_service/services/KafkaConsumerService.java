package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.repositories.LecteurNewsletterDesabonnementRepository;
import com.example.newsletter_service.repositories.LecteurRepository;
import com.example.newsletter_service.emails.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Service
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConsumerService {

        private final EmailService emailService;
        private final LecteurRepository lecteurRepository;
        private final LecteurNewsletterDesabonnementRepository desabonnementRepository;

        @KafkaListener(topics = "newsletter.updates", groupId = "newsletter-email-service", containerFactory = "kafkaListenerContainerFactory")
        public void consumeNewsletterEvent(
                        ConsumerRecord<String, NewsletterPublishedEvent> record,
                        Acknowledgment acknowledgment) {

                NewsletterPublishedEvent event = record.value();
                log.info("📩 Reçu event newsletter: {} ({})", event.getNewsletterId(), event.getTitre());

                processNewsletter(event)
                                .doOnSuccess(emailsSent -> {
                                        acknowledgment.acknowledge();
                                        log.info("✅ Newsletter {} traitée. {} emails envoyés.", event.getNewsletterId(),
                                                        emailsSent);
                                })
                                .doOnError(e -> {
                                        log.error("❌ Erreur traitement newsletter {}: {}", event.getNewsletterId(),
                                                        e.getMessage());
                                        // On n'ack pas pour que Kafka redélivre plus tard si c'est une erreur
                                        // transitoire
                                })
                                .subscribe();
        }

        private Mono<Integer> processNewsletter(NewsletterPublishedEvent event) {
                if (event.getCategorieIds() == null || event.getCategorieIds().isEmpty()) {
                        log.warn("⚠️ Newsletter {} sans catégories, aucun envoi.", event.getNewsletterId());
                        return Mono.just(0);
                }

                AtomicInteger sentCount = new AtomicInteger(0);

                // 1. Récupérer TOUS les lecteurs abonnés à AU MOINS UNE des catégories
                // (DISTINCT via SQL)
                return lecteurRepository.findDistinctByCategoriesIn(event.getCategorieIds())
                                // 2. Filtrer ceux qui se sont désabonnés spécifiquement de CETTE newsletter
                                .filterWhen(lecteur -> desabonnementRepository
                                                .existsByLecteurIdAndNewsletterId(lecteur.getId(),
                                                                event.getNewsletterId())
                                                .map(exists -> !exists) // Garder si PAS désabonné
                                )
                                // 3. Envoyer l'email
                                .flatMap(lecteur -> emailService
                                                .sendNewsletterEmail(lecteur, event.getTitre(), event.getContenu())
                                                .doOnSuccess(v -> {
                                                        sentCount.incrementAndGet();
                                                        log.debug("📧 Email envoyé à {}", lecteur.getEmail());
                                                })
                                                .onErrorResume(e -> {
                                                        log.error("⚠️ Echec envoi email à {}: {}", lecteur.getEmail(),
                                                                        e.getMessage());
                                                        return Mono.empty(); // Continuer pour les autres
                                                }))
                                .then(Mono.fromCallable(sentCount::get));
        }
}