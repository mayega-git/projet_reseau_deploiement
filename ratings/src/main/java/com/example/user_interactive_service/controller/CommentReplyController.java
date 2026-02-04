package com.example.user_interactive_service.controller;

import com.example.user_interactive_service.dto.CommentReplyDTO;
import com.example.user_interactive_service.models.CommentReply;
import com.example.user_interactive_service.repository.CommentRepository;
import com.example.user_interactive_service.service.CommentReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/education-service/ratings/comment_replies")
@Validated
@Tag(name = "Réponses aux commentaires", description = "Endpoints pour la gestion des réponses aux commentaires.")
public class CommentReplyController {

    private final CommentReplyService commentReplyService;
    private final CommentRepository commentRepository;

    public CommentReplyController(CommentReplyService commentReplyService, CommentRepository commentRepository) {
        this.commentReplyService = commentReplyService;
        this.commentRepository = commentRepository;
    }


    @PostMapping
    @Operation(summary = "Créer une réponse à un commentaire", description = "Crée une réponse pour un commentaire donné.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Réponse créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Erreur de validation dans les données")
    })
    public Mono<ResponseEntity<CommentReply>> createReply(
            @RequestBody @Valid CommentReplyDTO commentReplyDTO) {
        return commentReplyService.createReply(commentReplyDTO)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{commentId}")
    @Operation(summary = "Créer une réponse à un commentaire", description = "Crée une réponse pour un commentaire donné.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Réponse créée avec succès"),
            @ApiResponse(responseCode = "400", description = "ID du commentaire ne correspond pas")
    })

    public Mono<ResponseEntity<CommentReply>> createReply(
            @Parameter(description = "L'ID du commentaire auquel la réponse est liée")
            @PathVariable("commentId") UUID commentId,
            @RequestBody @Validated CommentReplyDTO commentReplyDTO) {

        return commentRepository.findById(commentId)
                .flatMap(comment -> {
                    commentReplyDTO.setCommentId(commentId);
                    return commentReplyService.createReply(commentReplyDTO)
                                .map(saved -> ResponseEntity.ok(saved));
                    
                })
                            .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));
    }

    
    @DeleteMapping("/{replyId}")
    @Operation(summary = "Supprimer une réponse", description = "Supprime une réponse spécifique par son ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Réponse supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Réponse non trouvée")
    })
    public Mono<ResponseEntity<Object>> deleteReply(@PathVariable("replyId") UUID replyId) {
        return commentReplyService.deleteReply(replyId)
                .then(Mono.just(ResponseEntity.noContent().build()))
                .onErrorResume(e -> Mono.just(ResponseEntity.<Void>notFound().build()));
    }

    /*public Mono<ResponseEntity<Void>> deleteReply(
            @Parameter(description = "L'ID de la réponse à supprimer")
            @PathVariable UUID replyId) {

        return commentReplyService.deleteReply(replyId)
                .thenReturn(ResponseEntity.noContent().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.notFound().build()));
    }*/

    @GetMapping("/{commentId}")
    @Operation(summary = "Récupérer toutes les réponses", description = "Récupère toutes les réponses associées à un commentaire donné.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Réponses récupérées avec succès"),
            @ApiResponse(responseCode = "404", description = "Aucune réponse trouvée pour ce commentaire")
    })
    public Flux<CommentReply> getRepliesForComment(
            @Parameter(description = "L'ID du commentaire pour lequel récupérer les réponses")
            @PathVariable("commentId") UUID commentId) {
        return commentReplyService.getRepliesForComment(commentId);
    }

    @GetMapping("/replies")
    @Operation(summary = "Récupérer toutes les réponses", description = "Récupère toutes les réponses existantes.")
    @ApiResponse(responseCode = "200", description = "Réponses récupérées avec succès")
    public Flux<CommentReply> getAllReplies() {
        return commentReplyService.getAllReplies();
    }
}


