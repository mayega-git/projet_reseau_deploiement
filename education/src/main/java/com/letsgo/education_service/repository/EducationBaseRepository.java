package com.letsgo.education_service.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.NoRepositoryBean;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import com.letsgo.education_service.enums.ContentStatus;

@NoRepositoryBean
public interface EducationBaseRepository<T> extends R2dbcRepository<T, UUID> {

    Mono<Integer> countByAuthorIdAndStatus(UUID authorId, ContentStatus status);

    Flux<T> findByAuthorIdAndStatus(UUID authorId, ContentStatus status);

    Flux<T> findByAuthorId(UUID authorId);

    Flux<T> findByStatus(ContentStatus status);

}
