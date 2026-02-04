package com.forum.controller;

import com.forum.model.Commentaire;
import com.forum.service.CommentaireService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/education-service/forum/commentaires")
@RequiredArgsConstructor
public class CommentaireController {

    private final CommentaireService commentaireService;

    // 🔹 Ajouter un commentaire
    @PostMapping("/")
    public Mono<ResponseEntity<Object>> createCommentaire(@RequestBody @Valid Commentaire commentaire) {
        return commentaireService.createCommentaire(commentaire)
                .map(saved -> ResponseEntity.ok((Object) saved))
                .onErrorResume(IllegalArgumentException.class, e -> Mono.just(ResponseEntity.badRequest().body(e.getMessage())))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }

    // 🔹 Récupérer les commentaires d'un post avec hiérarchie
    @GetMapping("/post/{postId}")
    public Mono<ResponseEntity<List<Commentaire>>> getCommentairesByPost(@PathVariable("postId") UUID postId) {
        return commentaireService.getCommentairesByPost(postId)
                .map(ResponseEntity::ok);
    }

    // 🔹 Mettre à jour un commentaire
    @PutMapping("/{commentaireId}")
    public Mono<ResponseEntity<Object>> updateCommentaire(@PathVariable("commentaireId") UUID commentaireId, @RequestBody @Valid Commentaire updatedCommentaire) {
        return commentaireService.updateCommentaire(commentaireId, updatedCommentaire)
                .map(updated -> ResponseEntity.ok((Object) updated))
                .onErrorResume(IllegalArgumentException.class, e -> Mono.just(ResponseEntity.badRequest().body(e.getMessage())))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }

    // 🔹 Supprimer un commentaire (soft delete)
    @DeleteMapping("/{commentaireId}")
    public Mono<ResponseEntity<Void>> deleteCommentaire(@PathVariable("commentaireId") UUID commentaireId) {
        return commentaireService.deleteCommentaire(commentaireId)
                .thenReturn(ResponseEntity.noContent().<Void>build())
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }
}
