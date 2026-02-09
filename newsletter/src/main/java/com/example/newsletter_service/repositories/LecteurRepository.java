package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.Lecteur;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Locale;
import java.util.UUID;

@Repository
public interface LecteurRepository extends R2dbcRepository<Lecteur, UUID> {

    Mono<Lecteur> findById(UUID id);

    Mono<Lecteur> findByEmail(String email);

    Mono<Boolean> existsByEmail(String email);

    @Query("SELECT DISTINCT l.* FROM lecteur l " +
            "JOIN lecteur_categorie_abonnement a ON l.id = a.lecteur_id " +
            "WHERE a.categorie_id IN (:categoryIds)")
    Flux<Lecteur> findDistinctByCategoriesIn(java.util.List<UUID> categoryIds);

}