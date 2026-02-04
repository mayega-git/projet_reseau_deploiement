package com.education_service.apiKeygateway.repository;

import com.education_service.apiKeygateway.models.Permission;

import reactor.core.publisher.Flux;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends R2dbcRepository<Permission, UUID> {



    @Query("SELECT * FROM permission WHERE request_token_id = :requestTokenId")
    Flux<Permission> findAllByRequestTokenId(UUID requestTokenId);
}
