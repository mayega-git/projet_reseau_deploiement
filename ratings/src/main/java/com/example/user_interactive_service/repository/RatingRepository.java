package com.example.user_interactive_service.repository;

import com.example.user_interactive_service.models.Ratings;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;

import reactor.core.publisher.Mono;

public interface RatingRepository extends R2dbcRepository<Ratings, UUID> {

    Mono<Ratings> findByUserId(UUID userId);
}
