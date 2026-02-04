package com.letsgo.education_service.repository;

import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.models.Favorite;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;



public interface FavoriteRepository extends R2dbcRepository<Favorite, UUID> {
    

    Flux<Favorite> findByUserId(UUID userId);


    Mono<Long> countByEntityId(UUID  entity_id);

    

    Mono<Favorite> findByUserIdAndEntityIdAndContentType(UUID userId,UUID entity_id, ContentType contentType);
}
