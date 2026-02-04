package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.LecteurNewsletterDesabonnement;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface LecteurNewsletterDesabonnementRepository extends R2dbcRepository<LecteurNewsletterDesabonnement, UUID> {
    Mono<Boolean> existsByLecteurIdAndNewsletterId(UUID lecteurId, UUID newsletterId);
}