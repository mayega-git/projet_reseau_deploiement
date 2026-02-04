package com.forum.repository;

import com.forum.model.Categorie;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

@Repository
public interface ForumCategorieRepository extends ReactiveCrudRepository<Categorie, UUID> {
    Flux<Categorie> findByGroupeId(UUID groupeId);
    Mono<Categorie> findByCategorieName(String categorieName);

}
