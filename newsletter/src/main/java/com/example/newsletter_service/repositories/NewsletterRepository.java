package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.Newsletter;
import com.example.newsletter_service.enums.StatutNewsletter;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface NewsletterRepository extends R2dbcRepository<Newsletter, UUID> {

    Flux<Newsletter> findByStatut(StatutNewsletter statut);
    Flux<Newsletter> findByRedacteurId(UUID redacteurId);
    
    @Query("SELECT n.* FROM newsletter n " +
           "INNER JOIN newsletter_categorie nc ON n.id = nc.newsletter_id " +
           "WHERE nc.categorie_id = :categorieId AND n.statut = 'PUBLIEE'")
    Flux<Newsletter> findPublishedByCategorieId(UUID categorieId);
}
