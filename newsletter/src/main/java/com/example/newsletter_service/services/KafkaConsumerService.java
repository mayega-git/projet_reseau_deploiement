package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.repositories.LecteurCategorieAbonnementRepository;
import com.example.newsletter_service.repositories.LecteurNewsletterDesabonnementRepository;
import com.example.newsletter_service.repositories.LecteurRepository;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerService {
    
    private final EmailService emailService;
    private final LecteurRepository lecteurRepository;
    private final LecteurCategorieAbonnementRepository abonnementRepository;
    private final LecteurNewsletterDesabonnementRepository desabonnementRepository;
    
    /**
     * Méthode de traitement appelée programmatiquement par les listeners dynamiques
     */
    public void consumeNewsletterEvent(
            ConsumerRecord<String, NewsletterPublishedEvent> record,
            Acknowledgment acknowledgment) {
        
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
        
        log.info(" Newsletter {} appartient à {} catégorie(s)", 
                 event.getNewsletterId(),
                 event.getCategorieIds().size());
        
        processNewsletterForConsumerGroup(event, partition)
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
            int partition) {
        
        UUID newsletterId = event.getNewsletterId();
        AtomicInteger emailsSentCount = new AtomicInteger(0);
        AtomicInteger eligibleCount = new AtomicInteger(0);
        
        log.info(" Recherche des lecteurs éligibles pour la newsletter {}", newsletterId);
        
        return getEligibleLecteurs(newsletterId, event.getCategorieIds())
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
                    event.getContenu()
                )
                .doOnSuccess(v -> {
                    emailsSentCount.incrementAndGet();
                    log.info(" Email envoyé avec succès à {} pour la newsletter '{}'", 
                            lecteur.getEmail(),
                            event.getTitre());
                })
                .doOnError(e -> 
                    log.error(" Échec de l'envoi de l'email à {}: {}", 
                            lecteur.getEmail(), 
                            e.getMessage())
                )
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
     * Sélectionne les lecteurs éligibles (retourne des objets Lecteur complets)
     * 
     * CRITÈRES D'ÉLIGIBILITÉ:
     * 1. Le lecteur DOIT être abonné à AU MOINS UNE des catégories de la newsletter
     * 2. Le lecteur NE DOIT PAS s'être désabonné de cette newsletter spécifique
     */
    private Flux<Lecteur> getEligibleLecteurs(UUID newsletterId, java.util.List<UUID> categorieIds) {
        
        if (categorieIds == null || categorieIds.isEmpty()) {
            log.warn(" Newsletter {} n'a aucune catégorie, aucun lecteur ne recevra d'email", 
                    newsletterId);
            return Flux.empty();
        }
        
        log.debug("🔍 Recherche des abonnés aux catégories: {}", categorieIds);
        
        // 1. Récupérer tous les lecteurs abonnés aux catégories
        return abonnementRepository.findAll()
            .filter(abonnement -> categorieIds.contains(abonnement.getCategorieId()))
            .doOnNext(abonnement -> 
                log.debug("  → Lecteur {} abonné à la catégorie {}", 
                        abonnement.getLecteurId(), 
                        abonnement.getCategorieId())
            )
            .map(abonnement -> abonnement.getLecteurId())
            .distinct()
            .doOnNext(lecteurId -> 
                log.debug("  ✓ Lecteur unique trouvé: {}", lecteurId)
            )
            // 2. Filtrer ceux qui se sont désabonnés
            .filterWhen(lecteurId -> 
                desabonnementRepository
                    .existsByLecteurIdAndNewsletterId(lecteurId, newsletterId)
                    .doOnNext(isUnsubscribed -> {
                        if (isUnsubscribed) {
                            log.info("  ⊗ Lecteur {} exclu: désabonné de la newsletter {}", 
                                    lecteurId, newsletterId);
                        }
                    })
                    .map(exists -> !exists)
            )
            // 3. Récupérer les objets Lecteur complets
            .flatMap(lecteurId -> 
                lecteurRepository.findById(lecteurId)
                    .doOnSuccess(lecteur -> {
                        if (lecteur != null) {
                            log.debug("  ✓ Lecteur récupéré: {} ({})", 
                                    lecteur.getEmail(), 
                                    lecteur.getId());
                        }
                    })
                    .switchIfEmpty(Mono.fromRunnable(() -> 
                        log.warn("   Lecteur {} introuvable dans la base", lecteurId)
                    ))
            )
            .doOnComplete(() -> 
                log.debug("✓ Récupération des lecteurs éligibles terminée")
            );
    }
}