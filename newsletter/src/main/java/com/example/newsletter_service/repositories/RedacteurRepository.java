package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.Redacteur;
import com.example.newsletter_service.enums.RedacteurStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface RedacteurRepository extends R2dbcRepository<Redacteur, UUID> {
    
    Mono<Redacteur> findByEmail(String email);
    
    Mono<Boolean> existsByEmail(String email);
    
    // Trouver par statut
    Flux<Redacteur> findByStatus(RedacteurStatus status);
    
    // Trouver les demandes en attente triées par date
    @Query("SELECT * FROM redacteur WHERE status = :status ORDER BY created_at DESC")
    Flux<Redacteur> findByStatusOrderByCreatedAtDesc(RedacteurStatus status);
    
    // Trouver les demandes en attente avec pagination
    Flux<Redacteur> findByStatusOrderByCreatedAtDesc(RedacteurStatus status, Pageable pageable);
    
    // Compter par statut
    @Query("SELECT COUNT(*) FROM redacteur WHERE status = :status")
    Mono<Long> countByStatus(RedacteurStatus status);
    
    // Trouver les rédacteurs actifs (approuvés)
    @Query("SELECT * FROM redacteur WHERE status = 'APPROVED' ORDER BY created_at DESC")
    Flux<Redacteur> findAllActiveRedacteurs();
}