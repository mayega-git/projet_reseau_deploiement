package com.forum.service;

import com.forum.model.Commentaire;
import com.forum.repository.CommentaireRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;

    // 🔹 Ajouter un commentaire
    public Mono<Commentaire> createCommentaire(@Valid Commentaire commentaire) {
        if (commentaire.getContent() == null || commentaire.getContent().isBlank()) {
            return Mono.error(new IllegalArgumentException("Le contenu du commentaire ne peut pas être vide"));
        }
        if (commentaire.getAuthorId() == null) {
            return Mono.error(new IllegalArgumentException("L'auteur du commentaire est requis"));
        }
        if (commentaire.getPostId() == null && commentaire.getCommentaireParentId() == null) {
            return Mono.error(new IllegalArgumentException("Un commentaire doit être associé à un post ou à un autre commentaire"));
        }

        // 🔹 Générer un ID et la date de création
        commentaire.setCommentaireId(UUID.randomUUID());
        commentaire.setCreationDate(Instant.now());
        commentaire.markNew();

        return commentaireRepository.save(commentaire);
    }

    // 🔹 Récupérer les commentaires d'un post AVEC les réponses imbriquées
    public Mono<List<Commentaire>> getCommentairesByPost(UUID postId) {
        return commentaireRepository.findByPostId(postId)
                .collectList()
                .map(allCommentaires -> {
                    Map<UUID, Commentaire> commentaireMap = new HashMap<>();
                    for (Commentaire commentaire : allCommentaires) {
                        commentaire.setResponses(new ArrayList<>()); // Initialisation de la liste des réponses
                        if (commentaire.getSuppressionDate() != null) {
                            commentaire.setContent("Ce commentaire a été supprimé");
                        }
                        commentaireMap.put(commentaire.getCommentaireId(), commentaire);
                    }

                    List<Commentaire> commentairesParents = new ArrayList<>();
                    for (Commentaire commentaire : allCommentaires) {
                        if (commentaire.getCommentaireParentId() != null) {
                            Commentaire parent = commentaireMap.get(commentaire.getCommentaireParentId());
                            if (parent != null) {
                                parent.getResponses().add(commentaire);
                            }
                        } else {
                            commentairesParents.add(commentaire);
                        }
                    }
                    return commentairesParents;
                });
    }
    // 🔹 Récupérer le nombre de commentaires directs d'un post
    public Mono<Long> countDirectCommentairesByPost(UUID postId) {
        return commentaireRepository.findByPostId(postId)
                .filter(commentaire -> commentaire.getCommentaireParentId() == null)
                .count();
    }
    
    // 🔹 Mettre à jour un commentaire
    public Mono<Commentaire> updateCommentaire(UUID commentaireId, @Valid Commentaire updatedCommentaire) {
        return commentaireRepository.findById(commentaireId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Commentaire non trouvé")))
                .flatMap(existingCommentaire -> {
                    if (updatedCommentaire.getContent() != null && !updatedCommentaire.getContent().isBlank()) {
                        existingCommentaire.setContent(updatedCommentaire.getContent());
                    }
                    existingCommentaire.setModificationDate(Instant.now());
                    return commentaireRepository.save(existingCommentaire);
                });
    }

    // 🔹 Supprimer un commentaire (soft delete)
    public Mono<Void> deleteCommentaire(UUID commentaireId) {
        return commentaireRepository.findById(commentaireId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Commentaire non trouvé")))
                .flatMap(commentaire -> {
                    commentaire.setSuppressionDate(Instant.now());
                    return commentaireRepository.save(commentaire).then();
                });
    }
}
