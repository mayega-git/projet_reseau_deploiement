package com.forum.repository;

import com.forum.model.Post;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

@Repository
public interface PostRepository extends ReactiveCrudRepository<Post, UUID> {
    Flux<Post> findByGroupId(UUID groupId);
    Flux<Post> findByAuthorId(UUID authorId);
    @Query("SELECT * FROM post WHERE $1 = ANY (categorie_ids)")
    Flux<Post> findByCategorie(UUID categorieId);
    Mono<Post> findByTitle(String title);
}
