package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.repositories.LecteurCategorieAbonnementRepository;
import com.example.newsletter_service.repositories.LecteurNewsletterDesabonnementRepository;
import com.example.newsletter_service.repositories.LecteurRepository;
import com.example.newsletter_service.repositories.CategorieRepository; // Added import
import com.example.newsletter_service.emails.EmailService;
import com.example.newsletter_service.models.Lecteur;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
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
        private final CategorieRepository categorieRepository;
        private final LecteurCategorieAbonnementRepository abonnementRepository; // Restored
        private final LecteurNewsletterDesabonnementRepository desabonnementRepository; // Restored

        /**
         * Méthode de traitement appelée programmatiquement par les listeners dynamiques
         */
        public void consumeNewsletterEvent(
                        ConsumerRecord<String, NewsletterPublishedEvent> record,
                        Acknowledgment acknowledgment,
                        java.util.List<String> listenerTopics) { // Added listenerTopics

                NewsletterPublishedEvent event = record.value();
                String topic = record.topic();
                int partition = record.partition();
                long offset = record.offset();

                log.info(" [Topic: {}] [Partition: {}] [Offset: {}] Message reçu - Newsletter: {} ({})",
                                topic,
                                partition,
                                offset,
                                event.getNewsletterId(),
                                event.getTitre());

                log.info(" Listener listening to: {}", listenerTopics);

                processNewsletterForConsumerGroup(event, listenerTopics)
                                .doOnSuccess(emailsSent -> {
                                        acknowledgment.acknowledge();
                                        log.info(" [Newsletter: {}] Traitement terminé avec succès. " +
                                                        "{} email(s) envoyé(s). Offset {} committé.",
                                                        event.getNewsletterId(),
                                                        emailsSent,
                                                        offset);
                                })
                                .doOnError(e -> {
                                        log.error(" [Newsletter: {}] Erreur lors du traitement: {}. " +
                                                        "Offset NON committé → le message sera retraité",
                                                        event.getNewsletterId(),
                                                        e.getMessage(), e);
                                })
                                .subscribe();
        }

        /**
         * Traite un événement newsletter pour tous les lecteurs éligibles
         */
        private Mono<Integer> processNewsletterForConsumerGroup(
                        NewsletterPublishedEvent event,
                        java.util.List<String> listenerTopics) {

                UUID newsletterId = event.getNewsletterId();
                AtomicInteger emailsSentCount = new AtomicInteger(0);
                AtomicInteger eligibleCount = new AtomicInteger(0);

                log.info(" Recherche des lecteurs éligibles pour la newsletter {} (Scope: {})",
                                newsletterId, listenerTopics);

                return getEligibleLecteurs(newsletterId, event.getCategorieIds(), listenerTopics)
                                .doOnNext(lecteur -> {
                                        eligibleCount.incrementAndGet();
                                        log.debug("✓ Lecteur éligible trouvé: {} ({})",
                                                        lecteur.getEmail(),
                                                        lecteur.getId());
                                })
                                .flatMap(lecteur -> {
                                        log.info(" Envoi de l'email à {} ({})",
                                                        lecteur.getEmail(),
                                                        lecteur.getId());

                                        // Envoyer l'email avec l'objet Lecteur complet
                                        return emailService.sendNewsletterEmail(
                                                        lecteur,
                                                        event.getTitre(),
                                                        event.getContenu())
                                                        .doOnSuccess(v -> {
                                                                emailsSentCount.incrementAndGet();
                                                                log.info(" Email envoyé avec succès à {} pour la newsletter '{}'",
                                                                                lecteur.getEmail(),
                                                                                event.getTitre());
                                                        })
                                                        .doOnError(e -> log.error(
                                                                        " Échec de l'envoi de l'email à {}: {}",
                                                                        lecteur.getEmail(),
                                                                        e.getMessage()))
                                                        .onErrorResume(e -> {
                                                                log.warn(" Poursuite du traitement malgré l'échec d'envoi à {}",
                                                                                lecteur.getEmail());
                                                                return Mono.empty();
                                                        });
                                })
                                .then(Mono.fromCallable(() -> {
                                        int sent = emailsSentCount.get();
                                        int eligible = eligibleCount.get();

                                        log.info(" Résumé pour la newsletter {}: " +
                                                        "{} lecteur(s) éligible(s), {} email(s) envoyé(s)",
                                                        newsletterId, eligible, sent);

                                        return sent;
                                }));
        }

        /**
         * Sélectionne les lecteurs éligibles
         * 
         * CRITÈRES D'ÉLIGIBILITÉ STRICTS:
         * 1. Le lecteur DOIT être abonné à AU MOINS UNE des catégories de la newsletter
         * (Business Logic)
         * 2. Le lecteur DOIT avoir EXACTEMENT les abonnements correspondant au Consumer
         * Group (Infrastructure Logic)
         * Ceci empêche la duplication car chaque lecteur appartient à un seul Consumer
         * Group unique.
         * 3. Le lecteur NE DOIT PAS s'être désabonné de cette newsletter spécifique
         */
        private Flux<Lecteur> getEligibleLecteurs(
                        UUID newsletterId,
                        java.util.List<UUID> newsletterCategorieIds,
                        java.util.List<String> listenerTopics) {

                if (newsletterCategorieIds == null || newsletterCategorieIds.isEmpty()) {
                        return Flux.empty();
                }

                // 1. Convertir les topics du listener en IDs de catégorie
                return categorieRepository.findByKafkaTopicIn(listenerTopics)
                                .map(categorie -> categorie.getId())
                                .collectList()
                                .flatMapMany(listenerCategorieIds -> {

                                        if (listenerCategorieIds.isEmpty()) {
                                                log.warn("⚠️ Aucune catégorie trouvée pour les topics {}",
                                                                listenerTopics);
                                                return Flux.empty();
                                        }

                                        // Ordonner pour comparaison exacte (si nécessaire, mais containsAll suffira
                                        // avec size check)
                                        java.util.Collections.sort(listenerCategorieIds);

                                        // 2. Récupérer TOUS les lecteurs et leurs abonnements
                                        // Note: Optimisation possible -> faire une requête SQL native pour filtrer
                                        return abonnementRepository.findAll()
                                                        .groupBy(abonnement -> abonnement.getLecteurId())
                                                        .flatMap(groupedFlux -> groupedFlux.collectList()
                                                                        .flatMap(userAbonnements -> {
                                                                                UUID lecteurId = groupedFlux.key();

                                                                                // Liste des catégories auxquelles le
                                                                                // lecteur est abonné
                                                                                java.util.List<UUID> userCategorieIds = userAbonnements
                                                                                                .stream()
                                                                                                .map(a -> a.getCategorieId())
                                                                                                .sorted()
                                                                                                .collect(java.util.stream.Collectors
                                                                                                                .toList());

                                                                                // CHECK 1: Le lecteur a-t-il les mêmes
                                                                                // abonnements que le listener ?
                                                                                // C'est le coeur du fix
                                                                                // anti-duplication
                                                                                boolean matchesConsumerGroup = userCategorieIds
                                                                                                .size() == listenerCategorieIds
                                                                                                                .size()
                                                                                                && userCategorieIds
                                                                                                                .containsAll(listenerCategorieIds);

                                                                                if (!matchesConsumerGroup) {
                                                                                        log.debug("✕ Lecteur {} ignoré par ce groupe. (UserCats: {}, GroupCats: {})",
                                                                                                        lecteurId,
                                                                                                        userCategorieIds,
                                                                                                        listenerCategorieIds);
                                                                                        return Mono.empty();
                                                                                } else {
                                                                                        log.debug("✓ Lecteur {} correspond au groupe ! (UserCats: {}, GroupCats: {})",
                                                                                                        lecteurId,
                                                                                                        userCategorieIds,
                                                                                                        listenerCategorieIds);
                                                                                }

                                                                                // CHECK 2: Le lecteur est-il intéressé
                                                                                // par CETTE newsletter ?
                                                                                // (Intersection entre abonnements du
                                                                                // lecteur et catégories de la
                                                                                // newsletter)
                                                                                boolean interestedInNewsletter = userCategorieIds
                                                                                                .stream()
                                                                                                .anyMatch(newsletterCategorieIds::contains);

                                                                                if (!interestedInNewsletter) {
                                                                                        log.debug("✕ Lecteur {} non intéressé par cette newsletter. (UserCats: {}, NewsCats: {})",
                                                                                                        lecteurId,
                                                                                                        userCategorieIds,
                                                                                                        newsletterCategorieIds);
                                                                                        return Mono.empty();
                                                                                }

                                                                                return Mono.just(lecteurId);
                                                                        }))
                                                        // À ce stade on a les IDs des lecteurs qui appartiennent
                                                        // STRICTEMENT à ce groupe
                                                        .distinct()
                                                        .flatMap(lecteurId -> desabonnementRepository
                                                                        .existsByLecteurIdAndNewsletterId(lecteurId,
                                                                                        newsletterId)
                                                                        .filter(isUnsubscribed -> !isUnsubscribed) // Filtrer
                                                                                                                   // si
                                                                                                                   // désabonné
                                                                        .map(notUnsubscribed -> lecteurId)
                                                                        .switchIfEmpty(Mono.just(lecteurId)) // Si pas
                                                                                                             // d'entrée
                                                                                                             // désabo,
                                                                                                             // c'est
                                                                                                             // bon
                                        )
                                                        // Filtrer explicitement les désabonnés (le bloc ci-dessus est
                                                        // un peu complexe pour rien)
                                                        .filterWhen(lecteurId -> desabonnementRepository
                                                                        .existsByLecteurIdAndNewsletterId(lecteurId,
                                                                                        newsletterId)
                                                                        .map(exists -> !exists))
                                                        .flatMap(lecteurId -> lecteurRepository.findById(lecteurId));
                                });
        }
}