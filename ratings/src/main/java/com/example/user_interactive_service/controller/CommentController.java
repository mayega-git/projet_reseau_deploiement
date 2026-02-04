package com.example.user_interactive_service.controller;

import com.example.user_interactive_service.dto.CommentDTO;
import com.example.user_interactive_service.models.Comment;
import com.example.user_interactive_service.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
// @CrossOrigin(originPatterns = "*") commenter car ca bloque lmes requetes j'ai
// configurer ca directement dans le pakage config
@RequestMapping("/education-service/ratings/comments")
@Tag(name = "Commentaires", description = "Endpoints réactifs pour la gestion des commentaires d'entités.")
public class CommentController {

        private final CommentService commentService;

        public CommentController(CommentService commentService) {
                this.commentService = commentService;
        }

        @Operation(summary = "Récupérer tous les commentaires", description = "Cette opération permet de récupérer tous les commentaires existants.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Commentaires récupérés avec succès"),
                        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
        })
        @GetMapping
        public Flux<Comment> getAllComments() {
                return commentService.getAllComments();
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        @Operation(summary = "Créer un commentaire", description = "Permet de créer un commentaire pour une entité donnée.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Commentaire créé avec succès"),
                        @ApiResponse(responseCode = "400", description = "Données d'entrée invalides")
        })
        public Mono<Comment> createComment(@RequestBody CommentDTO commentCreateDTO) {

                // Appel du service pour l'enregistrer
                System.out.println(commentCreateDTO);
                return commentService.createComment(commentCreateDTO);
        }

        @Operation(summary = "Récupérer les commentaires d'une entité", description = "Cette opération permet de récupérer tous les commentaires liés à une entité.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Commentaires récupérés avec succès"),
                        @ApiResponse(responseCode = "404", description = "Aucun commentaire trouvé"),
                        @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
        })
        @GetMapping("/by-entityId")
        public Flux<Comment> getCommentsByEntityId(@RequestParam UUID entityId) {
                return commentService.getCommentsByEntityId(entityId);
        }

        @Operation(summary = "Supprimer un commentaire", description = "Supprime un commentaire à partir de son ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "Commentaire supprimé avec succès"),
                        @ApiResponse(responseCode = "404", description = "Commentaire non trouvé")
        })
        @DeleteMapping("/{commentId}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public Mono<Void> deleteComment(
                        @Parameter(description = "ID du commentaire à supprimer") @PathVariable("commentId") UUID commentId) {
                return commentService.deleteComment(commentId);
        }
}
