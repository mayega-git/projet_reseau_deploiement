package com.letsgo.education_service.repository;

import com.letsgo.education_service.models.Abonnement_entity;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface AbonnementRepository extends R2dbcRepository<Abonnement_entity, UUID> {

    Mono<Abonnement_entity> findByUserIdAndContentId(UUID userId, UUID contentId);

    Flux<Abonnement_entity> findAllByUserId(UUID userId);

    Mono<Long> countByContentId(UUID contentId);

    Mono<Void> deleteByUserIdAndContentId(UUID userId, UUID contentId);
}
