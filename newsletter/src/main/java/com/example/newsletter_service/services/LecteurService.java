package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.LecteurRegistrationRequest;
import com.example.newsletter_service.dto.UpdateCategoriesRequest;
import com.example.newsletter_service.dto.LecteurResponse;
import com.example.newsletter_service.models.Lecteur;
import com.example.newsletter_service.models.LecteurCategorieAbonnement;
import com.example.newsletter_service.models.LecteurNewsletterDesabonnement;
import com.example.newsletter_service.repositories.LecteurRepository;
import com.example.newsletter_service.dto.SubscribeRequest;
import com.example.newsletter_service.repositories.LecteurCategorieAbonnementRepository;
import com.example.newsletter_service.repositories.LecteurNewsletterDesabonnementRepository;
import com.example.newsletter_service.repositories.CategorieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service de gestion des lecteurs.
 * Refactoré : Plus de gestion dynamique des consumer groups Kafka.
 * Le ciblage se fait désormais à la lecture du message.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LecteurService {

    private final LecteurRepository lecteurRepository;
    private final LecteurCategorieAbonnementRepository abonnementRepository;
    private final LecteurNewsletterDesabonnementRepository desabonnementRepository;
    private final CategorieRepository categorieRepository;

    /**
     * NOUVEAU : Inscription d'un lecteur SANS catégories
     * Un lecteur sans abonnement recevra TOUTES les newsletters
     */
    public Mono<LecteurResponse> registerLecteur(LecteurRegistrationRequest request) {
        log.info(" Inscription d'un nouveau lecteur: {}", request.getEmail());

        // Créer le lecteur uniquement (pas d'abonnement)
        Lecteur lecteur = new Lecteur();
        lecteur.setEmail(request.getEmail());
        lecteur.setNom(request.getNom());
        lecteur.setPrenom(request.getPrenom());
        lecteur.setCreatedAt(LocalDateTime.now());

        return lecteurRepository.save(lecteur)
                .flatMap(this::buildLecteurResponse)
                .doOnSuccess(response -> log.info(" Lecteur inscrit avec succès: {} (aucun abonnement - recevra TOUT)",
                        response.getEmail()));
    }

    /**
     * NOUVEAU : Abonner un lecteur à des catégories (service séparé)
     * Si le lecteur s'abonne à des catégories, il ne recevra QUE ces catégories
     */
    public Mono<LecteurResponse> subscribeToCategories(UUID lecteurId, SubscribeRequest request) {
        log.info("📬 Abonnement du lecteur {} aux catégories: {}", lecteurId, request.getCategorieIds());

        return lecteurRepository.findById(lecteurId)
                .switchIfEmpty(Mono.error(new RuntimeException("Lecteur non trouvé")))
                .flatMap(lecteur -> {
                    // Créer les abonnements aux catégories
                    return Flux.fromIterable(request.getCategorieIds())
                            .flatMap(categorieId -> {
                                LecteurCategorieAbonnement abonnement = new LecteurCategorieAbonnement();
                                abonnement.setLecteurId(lecteurId);
                                abonnement.setCategorieId(categorieId);
                                abonnement.setSubscribedAt(LocalDateTime.now());
                                return abonnementRepository.save(abonnement);
                            })
                            .collectList()
                            .flatMap(abonnements -> {
                                // Plus de consumer group à gérer
                                return buildLecteurResponse(lecteur);
                            });
                })
                .doOnSuccess(response -> log.info(" Lecteur {} abonné aux catégories avec succès",
                        lecteurId));
    }

    /**
     * Récupère les préférences d'un lecteur
     */
    public Mono<LecteurResponse> getLecteurPreferences(UUID lecteurId) {
        return lecteurRepository.findById(lecteurId)
                .flatMap(this::buildLecteurResponse)
                .switchIfEmpty(Mono.error(new RuntimeException("Lecteur non trouvé")));
    }

    /**
     * Met à jour les catégories d'abonnement d'un lecteur
     */
    public Mono<LecteurResponse> updateCategories(UUID lecteurId, UpdateCategoriesRequest request) {
        log.info(" Mise à jour des catégories pour lecteur: {}", lecteurId);

        return lecteurRepository.findById(lecteurId)
                .switchIfEmpty(Mono.error(new RuntimeException("Lecteur non trouvé")))
                .flatMap(lecteur -> {
                    // 1. Supprimer tous les anciens abonnements
                    return abonnementRepository.deleteByLecteurId(lecteurId)
                            .then(Mono.just(lecteur));
                })
                .flatMap(lecteur -> {
                    // 2. Créer les nouveaux abonnements
                    return Flux.fromIterable(request.getCategorieIds())
                            .flatMap(categorieId -> {
                                LecteurCategorieAbonnement abonnement = new LecteurCategorieAbonnement();
                                abonnement.setLecteurId(lecteurId);
                                abonnement.setCategorieId(categorieId);
                                abonnement.setSubscribedAt(LocalDateTime.now());
                                return abonnementRepository.save(abonnement);
                            })
                            .collectList()
                            .then(Mono.just(lecteur));
                })
                .flatMap(lecteur -> {
                    // 3. Plus de gestion de consumer group
                    return buildLecteurResponse(lecteur);
                })
                .doOnSuccess(response -> log.info(" Catégories mises à jour pour lecteur: {}", lecteurId));
    }

    /**
     * NOUVEAU : Désabonner un lecteur de TOUTES les catégories
     * Après cela, le lecteur recevra à nouveau TOUTES les newsletters
     */
    public Mono<LecteurResponse> unsubscribeFromAllCategories(UUID lecteurId) {
        log.info("🗑️ Désabonnement du lecteur {} de TOUTES les catégories", lecteurId);

        return lecteurRepository.findById(lecteurId)
                .switchIfEmpty(Mono.error(new RuntimeException("Lecteur non trouvé")))
                .flatMap(lecteur -> {
                    // Supprimer tous les abonnements
                    return abonnementRepository.deleteByLecteurId(lecteurId)
                            .then(buildLecteurResponse(lecteur));
                })
                .doOnSuccess(response -> log.info(" Lecteur {} désabonné de toutes les catégories - Recevra TOUT",
                        lecteurId));
    }

    /**
     * Désabonne un lecteur d'une newsletter spécifique
     */
    public Mono<Void> unsubscribeFromNewsletter(UUID lecteurId, UUID newsletterId) {
        log.info(" Désabonnement du lecteur {} de la newsletter {}", lecteurId, newsletterId);

        LecteurNewsletterDesabonnement desabonnement = new LecteurNewsletterDesabonnement();
        desabonnement.setLecteurId(lecteurId);
        desabonnement.setNewsletterId(newsletterId);
        desabonnement.setUnsubscribedAt(LocalDateTime.now());

        return desabonnementRepository.save(desabonnement)
                .doOnSuccess(saved -> log.info(" Lecteur {} désabonné de la newsletter {}", lecteurId, newsletterId))
                .then();
    }

    /**
     * MODIFIÉ : Vérifie si un lecteur doit recevoir une newsletter
     * LOGIQUE :
     * - Si lecteur N'A AUCUN abonnement → reçoit TOUT
     * - Si lecteur A des abonnements → reçoit SEULEMENT ses catégories
     */
    public Mono<Boolean> shouldReceiveNewsletter(UUID lecteurId, UUID newsletterId) {
        return abonnementRepository.findByLecteurId(lecteurId)
                .collectList()
                .flatMap(abonnements -> {
                    // Si aucun abonnement → reçoit TOUT
                    if (abonnements.isEmpty()) {
                        log.debug(" Lecteur {} n'a pas d'abonnements → Reçoit TOUTES les newsletters", lecteurId);
                        return Mono.just(true);
                    }

                    // Si a des abonnements → vérifier si la newsletter correspond
                    return checkIfNewsletterMatchesSubscriptions(lecteurId, newsletterId, abonnements);
                });
    }

    /**
     * Vérifie si une newsletter correspond aux abonnements d'un lecteur
     */
    private Mono<Boolean> checkIfNewsletterMatchesSubscriptions(
            UUID lecteurId,
            UUID newsletterId,
            java.util.List<LecteurCategorieAbonnement> abonnements) {

        // À implémenter : vérifier si la newsletter appartient aux catégories du
        // lecteur
        // Pour l'instant, retourne true par défaut
        return Mono.just(true);
    }

    /**
     * Construit la réponse avec les informations du lecteur et ses catégories
     */
    private Mono<LecteurResponse> buildLecteurResponse(Lecteur lecteur) {
        return abonnementRepository.findByLecteurId(lecteur.getId())
                .map(LecteurCategorieAbonnement::getCategorieId)
                .collectList()
                .flatMap(categorieIds -> {
                    if (categorieIds.isEmpty()) {
                        // Pas d'abonnements
                        LecteurResponse response = new LecteurResponse();
                        response.setId(lecteur.getId());
                        response.setEmail(lecteur.getEmail());
                        response.setNom(lecteur.getNom());
                        response.setPrenom(lecteur.getPrenom());
                        response.setCreatedAt(lecteur.getCreatedAt());
                        return Mono.just(response);
                    }

                    // Avec abonnements
                    return categorieRepository.findByIdIn(categorieIds)
                            .map(categorie -> categorie.getNom())
                            .collectList()
                            .map(categorieNames -> {
                                LecteurResponse response = new LecteurResponse();
                                response.setId(lecteur.getId());
                                response.setEmail(lecteur.getEmail());
                                response.setNom(lecteur.getNom());
                                response.setPrenom(lecteur.getPrenom());
                                response.setCreatedAt(lecteur.getCreatedAt());
                                return response;
                            });
                });
    }

    /**
     * Récupère un lecteur par ID
     */
    public Mono<Lecteur> getLecteurById(UUID id) {
        return lecteurRepository.findById(id);
    }
}