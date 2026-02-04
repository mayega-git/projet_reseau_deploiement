package com.example.newsletter_service.repositories;

import com.example.newsletter_service.models.NewsletterCategorie;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface NewsletterCategorieRepository extends R2dbcRepository<NewsletterCategorie, UUID> {
    Flux<NewsletterCategorie> findByNewsletterId(UUID newsletterId);
    Flux<NewsletterCategorie> findByCategorieId(UUID categorieId);
}
