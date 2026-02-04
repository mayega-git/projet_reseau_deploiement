package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.LecteurCategorieAbonnement;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface LecteurCategorieAbonnementRepository extends R2dbcRepository<LecteurCategorieAbonnement, UUID> {
    Flux<LecteurCategorieAbonnement> findByLecteurId(UUID lecteurId);
    Mono<Void> deleteByLecteurIdAndCategorieId(UUID lecteurId, UUID categorieId);
    Mono<Boolean> existsByLecteurIdAndCategorieId(UUID lecteurId, UUID categorieId);
    
    // Trouver tous les lecteurs abonnés à une catégorie
    Flux<LecteurCategorieAbonnement> findByCategorieId(UUID categorieId);
    Mono<Void> deleteByLecteurId(UUID lecteurId);
}