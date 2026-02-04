package com.education_service.apiKeygateway.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

import com.education_service.apiKeygateway.models.Apikey;

import reactor.core.publisher.Mono;

import org.springframework.stereotype.Repository;

@Repository
public interface ApikeyRepository extends R2dbcRepository<Apikey, UUID>  {

    @Query("SELECT * FROM api_key WHERE status = 'ACTIVE'")
    Mono<Apikey> findAllActive();

    @Query("SELECT * FROM api_key WHERE client_id = :clientId")
    Mono<Apikey> findByClientId(UUID clientId);

    @Modifying
    @Query("DELETE FROM api_key")
    Mono<Void> deleteAll();
    
}
