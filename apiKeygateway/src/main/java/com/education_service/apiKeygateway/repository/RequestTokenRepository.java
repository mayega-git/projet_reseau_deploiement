package com.education_service.apiKeygateway.repository;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.education_service.apiKeygateway.enums.Status;
import com.education_service.apiKeygateway.models.RequestToken;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface RequestTokenRepository extends R2dbcRepository<RequestToken, UUID> {

    @Query("SELECT * FROM request_token WHERE status_request_token = :status")
    Flux<RequestToken> findByStatus(String status);

    @Query("SELECT * FROM request_token")
    Flux<RequestToken> findAll();

    @Query("""
    UPDATE request_token
    SET status_request_token = :status,
        accepted_at = :acceptedAt
    WHERE id = :id
    """)
    Mono<Integer> updateStatus(
        @Param("id") UUID id,
        @Param("status") String status,
        @Param("acceptedAt") LocalDateTime acceptedAt
    );


}
