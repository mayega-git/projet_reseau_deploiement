package com.example.newsletter_service.services;


import com.example.newsletter_service.models.Newsletter;
import com.example.newsletter_service.repositories.CategorieRepository;
import com.example.newsletter_service.repositories.NewsletterRepository;


import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.dto.NewsletterCreateRequest;
import com.example.newsletter_service.dto.NewsletterResponse;
import com.example.newsletter_service.models.Categorie;

import com.example.newsletter_service.models.NewsletterCategorie;
import com.example.newsletter_service.models.Redacteur;
import com.example.newsletter_service.enums.StatutNewsletter;
import com.example.newsletter_service.exception.ResourceNotFoundException;


import com.example.newsletter_service.repositories.NewsletterCategorieRepository;

import com.example.newsletter_service.repositories.RedacteurRepository;
import com.example.newsletter_service.kafka.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsletterService {
    
    private final NewsletterRepository newsletterRepository;
    private final NewsletterCategorieRepository newsletterCategorieRepository;
    private final CategorieRepository categorieRepository;
    private final RedacteurRepository redacteurRepository;
    private final KafkaProducerService kafkaProducerService;
    
    /**
     * Crée une nouvelle newsletter en statut BROUILLON
     */
    @Transactional
    public Mono<NewsletterResponse> createNewsletter(
            UUID redacteurId,
            NewsletterCreateRequest request) {
        
        log.info("Création d'une newsletter par le rédacteur {}", redacteurId);
        
        Newsletter newsletter = Newsletter.builder()
            .titre(request.getTitre())
            .contenu(request.getContenu())
            .statut(StatutNewsletter.BROUILLON)
            .redacteurId(redacteurId)
            .createdAt(LocalDateTime.now())
            .build();
        
        return newsletterRepository.save(newsletter)
            .flatMap(savedNewsletter -> 
                // Associer les catégories
                Flux.fromIterable(request.getCategorieIds())
                    .flatMap(categorieId -> {
                        NewsletterCategorie nc = NewsletterCategorie.builder()
                            .newsletterId(savedNewsletter.getId())
                            .categorieId(categorieId)
                            .build();
                        return newsletterCategorieRepository.save(nc);
                    })
                    .then(Mono.just(savedNewsletter))
            )
            .flatMap(this::mapToResponse)
            .doOnSuccess(response -> 
                log.info("Newsletter {} créée avec succès", response.getId()));
    }
    
    /**
     * Soumet une newsletter pour validation (BROUILLON → SOUMISE)
     */
    @Transactional
    public Mono<NewsletterResponse> submitNewsletter(UUID newsletterId, UUID redacteurId) {
        return newsletterRepository.findById(newsletterId)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(newsletterId)))
            .flatMap(newsletter -> {
                
                if (newsletter.getStatut() != StatutNewsletter.BROUILLON) {
                    return Mono.error(new IllegalStateException(
                        "Seules les newsletters en brouillon peuvent être soumises"));
                }
                
                newsletter.setStatut(StatutNewsletter.SOUMISE);
                return newsletterRepository.save(newsletter);
            })
            .flatMap(this::mapToResponse)
            .doOnSuccess(response -> 
                log.info(" Newsletter {} soumise pour validation", newsletterId));
    }
    
    /**
     * Valide une newsletter (Admin) (SOUMISE → VALIDÉE)
     */
    @Transactional
    public Mono<NewsletterResponse> validateNewsletter(UUID newsletterId) {
        return updateNewsletterStatut(newsletterId, StatutNewsletter.VALIDEE)
            .doOnSuccess(response -> 
                log.info("Newsletter {} validée par l'admin", newsletterId));
    }
    
    /**
     * Rejette une newsletter (Admin) (SOUMISE → REJETÉE)
     */
    @Transactional
    public Mono<NewsletterResponse> rejectNewsletter(UUID newsletterId) {
        return updateNewsletterStatut(newsletterId, StatutNewsletter.REJETEE)
            .doOnSuccess(response -> 
                log.info(" Newsletter {} rejetée par l'admin", newsletterId));
    }
    
    /**
     * Publie une newsletter (Admin) (VALIDÉE → PUBLIÉE)
     * C'EST ICI QUE LA MAGIE KAFKA OPÈRE !
     */
    @Transactional
    public Mono<NewsletterResponse> publishNewsletter(UUID newsletterId) {
        log.info("Début de la publication de la newsletter {}", newsletterId);
        
        return newsletterRepository.findById(newsletterId)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(newsletterId)))
            .flatMap(newsletter -> {
                // Vérifier le statut
                if (newsletter.getStatut() != StatutNewsletter.VALIDEE) {
                    return Mono.error(new IllegalStateException(
                        "Seules les newsletters validées peuvent être publiées"));
                }
                
                // Mettre à jour le statut et la date de publication
                newsletter.setStatut(StatutNewsletter.PUBLIEE);
                newsletter.setPublishedAt(LocalDateTime.now());
                
                return newsletterRepository.save(newsletter)
                    .flatMap(publishedNewsletter -> 
                        // Récupérer les catégories associées
                        getCategoriesForNewsletter(newsletterId)
                            .collectList()
                            .flatMap(categories -> {
                                // Créer l'événement Kafka
                                NewsletterPublishedEvent event = buildPublishedEvent(
                                    publishedNewsletter, 
                                    categories
                                );
                                
                                // PUBLIER DANS KAFKA !
                                return kafkaProducerService
                                    .publishNewsletterToCategories(event, categories)
                                    .thenReturn(publishedNewsletter);
                            })
                    );
            })
            .flatMap(this::mapToResponse)
            .doOnSuccess(response -> 
                log.info(" Newsletter {} publiée et envoyée dans Kafka !", newsletterId));
    }
    
    /**
     * Récupère toutes les newsletters d'un rédacteur
     */
    public Flux<NewsletterResponse> getNewslettersByRedacteur(UUID redacteurId) {
        return newsletterRepository.findByRedacteurId(redacteurId)
            .flatMap(this::mapToResponse);
    }
    
    /**
     * Récupère les newsletters par statut
     */
    public Flux<NewsletterResponse> getNewslettersByStatut(StatutNewsletter statut) {
        return newsletterRepository.findByStatut(statut)
            .flatMap(this::mapToResponse);
    }
    
    // === Méthodes utilitaires ===
    
    private Mono<NewsletterResponse> updateNewsletterStatut(UUID id, StatutNewsletter statut) {
        return newsletterRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
            .flatMap(newsletter -> {
                newsletter.setStatut(statut);
                return newsletterRepository.save(newsletter);
            })
            .flatMap(this::mapToResponse);
    }
    
    private Flux<Categorie> getCategoriesForNewsletter(UUID newsletterId) {
        return newsletterCategorieRepository.findByNewsletterId(newsletterId)
            .flatMap(nc -> categorieRepository.findById(nc.getCategorieId()));
    }
    
    private NewsletterPublishedEvent buildPublishedEvent(
            Newsletter newsletter, 
            List<Categorie> categories) {
        
        return NewsletterPublishedEvent.builder()
            .newsletterId(newsletter.getId())
            .titre(newsletter.getTitre())
            .contenu(newsletter.getContenu())
            .redacteurId(newsletter.getRedacteurId())
            .categorieIds(categories.stream().map(Categorie::getId).toList())
            .publishedAt(newsletter.getPublishedAt())
            .build();
    }
    
    private Mono<NewsletterResponse> mapToResponse(Newsletter newsletter) {
        return getCategoriesForNewsletter(newsletter.getId())
            .map(cat -> com.example.newsletter_service.dto.CategorieResponse.builder()
                .id(cat.getId())
                .nom(cat.getNom())
                .description(cat.getDescription())
                .build())
            .collectList()
            .map(categories -> NewsletterResponse.builder()
                .id(newsletter.getId())
                .titre(newsletter.getTitre())
                .contenu(newsletter.getContenu())
                .statut(newsletter.getStatut())
                .redacteurId(newsletter.getRedacteurId())
                .categories(categories)
                .createdAt(newsletter.getCreatedAt())
                .publishedAt(newsletter.getPublishedAt())
                .build());
    }
}