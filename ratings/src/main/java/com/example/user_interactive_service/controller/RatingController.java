package com.example.user_interactive_service.controller;

import com.example.user_interactive_service.enums.EntityType;
import com.example.user_interactive_service.models.Ratings;
import com.example.user_interactive_service.service.RatingService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.UUID;

@RestController
@RequestMapping("/education-service/ratings")
@Tag(name = "Évaluations", description = "Endpoints pour la gestion des évaluations et des likes/dislikes.")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/like-or-dislike")

    @Operation(summary = "Donner un like ou un dislike", description = "Permet à un utilisateur d'aimer ou de ne pas aimer une entité.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Action enregistrée avec succès"),
            @ApiResponse(responseCode = "400", description = "Paramètres invalides")
    })
    public Mono<ResponseEntity<String>> likeOrDislike(
            @RequestParam(name = "userId") UUID userId,
            @RequestParam(name = "entityId") UUID entityId,
            @RequestParam(name = "entityType") EntityType entityType,
            @RequestParam(name = "isLike") Boolean isLike) {

        return ratingService.likeOrDislike(userId, entityId, entityType, isLike)
                .thenReturn(ResponseEntity.ok("Action enregistrée avec succès !"));
    }

    @GetMapping("/totalLikes")
    @Operation(summary = "Obtenir le nombre total de likes", description = "Retourne le nombre total de likes pour une entité donnée.")
    public Mono<ResponseEntity<Integer>> getTotalLikes(@RequestParam(name = "entityId") UUID entityId) {

        return ratingService.getTotalLikes(entityId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/totalDislikes")
    @Operation(summary = "Obtenir le nombre total de dislikes", description = "Retourne le nombre total de dislikes pour une entité donnée.")
    public Mono<ResponseEntity<Integer>> getTotalDislikes(@RequestParam(name = "entityId") UUID entityId) {
        return ratingService.getTotalDislikes(entityId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/hasLiked")
    @Operation(summary = "Vérifie si un utilisateur a liké", description = "Retourne un booléen indiquant si l'utilisateur a liké une entité.")
    public Mono<ResponseEntity<Boolean>> hasUserLiked(@RequestParam(name = "userId") UUID userId,
            @RequestParam(name = "entityId") UUID entityId) {
        return ratingService.hasUserLiked(userId, entityId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/hasDisliked")
    @Operation(summary = "Vérifie si un utilisateur a disliké", description = "Retourne un booléen indiquant si l'utilisateur a disliké une entité.")
    public Mono<ResponseEntity<Boolean>> hasUserDisliked(@RequestParam(name = "userId") @NotNull UUID userId,
            @RequestParam(name = "entityId") @NotNull UUID entityId) {
        return ratingService.hasUserDisliked(userId, entityId)
                .map(ResponseEntity::ok);
    }

    @GetMapping
    @Operation(summary = "Obtenir toutes les évaluations", description = "Récupère toutes les évaluations effectuées.")
    public Flux<Ratings> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @PostMapping("/rate-application")
    @Operation(summary = "Évaluer l'application", description = "Permet à un utilisateur d'évaluer l'application avec un score et un commentaire.")

    public Mono<ResponseEntity<String>> rateApplication(
            @RequestParam(name = "userId") UUID userId,
            @RequestParam(name = "entityId", required = false) UUID entityId,
            @RequestParam(name = "entityType", defaultValue = "APPLICATION") EntityType entityType,
            @RequestParam(name = "score") int score,
            @RequestParam(name = "feedback", required = false) String feedback) {
        System.out.println("HELLO");
        return ratingService.rateApplication(userId, entityId, entityType, score, feedback)
                .thenReturn(ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"message\": \"Merci pour votre évaluation !\"}"))
                .onErrorResume(IllegalArgumentException.class,
                        e -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage())));
    }
}
