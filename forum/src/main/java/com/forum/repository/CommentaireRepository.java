package com.forum.repository;

import com.forum.model.Commentaire;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import java.util.UUID;

@Repository
public interface CommentaireRepository extends ReactiveCrudRepository<Commentaire, UUID> {

    Flux<Commentaire> findByPostId(UUID postId);

    Flux<Commentaire> findByCommentaireParentId(UUID parentId);
}
