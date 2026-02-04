package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.Categorie;
import com.example.newsletter_service.enums.Domain;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Collection;

import java.util.UUID;

@Repository
public interface CategorieRepository extends R2dbcRepository<Categorie, UUID> {
    
  Mono<Categorie> findByNom(String nom);
  Mono<Categorie> findByKafkaTopic(String kafkaTopic);
  Flux<Categorie> findByIdIn(Collection<UUID> ids);
    
}
