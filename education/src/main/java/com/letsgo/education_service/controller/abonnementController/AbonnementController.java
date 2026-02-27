package com.letsgo.education_service.controller.abonnementController;

import com.letsgo.education_service.dto.abonnementDTO.AbonnementCreateDTO;
import com.letsgo.education_service.dto.abonnementDTO.AbonnementResponseDTO;
import com.letsgo.education_service.service.abonnementService.AbonnementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/education-service/education/abonnements")
@RequiredArgsConstructor
public class AbonnementController {

    private final AbonnementService abonnementService;

    @PostMapping
    @Operation(summary = "S'abonner à un contenu (Blog, Podcast, Course)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Abonnement créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide ou abonnement existant")
    })
    public Mono<ResponseEntity<AbonnementResponseDTO>> subscribe(
            @RequestHeader(value = "X-User-Id", required = true) UUID userId,
            @Valid @RequestBody AbonnementCreateDTO createDTO) {
        return abonnementService.subscribe(userId, createDTO)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response))
                .onErrorResume(RuntimeException.class, e -> Mono.just(ResponseEntity.badRequest().build()));
    }

    @DeleteMapping("/{contentId}")
    @Operation(summary = "Se désabonner d'un contenu")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Désabonnement réussi")
    })
    public Mono<ResponseEntity<Void>> unsubscribe(
            @RequestHeader(value = "X-User-Id", required = true) UUID userId,
            @PathVariable UUID contentId) {
        return abonnementService.unsubscribe(userId, contentId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }

    @GetMapping("/user")
    @Operation(summary = "Obtenir la liste des abonnements d'un utilisateur")
    public Flux<AbonnementResponseDTO> getUserSubscriptions(
            @RequestHeader(value = "X-User-Id", required = true) UUID userId) {
        return abonnementService.getUserSubscriptions(userId);
    }

    @GetMapping("/content/{contentId}/count")
    @Operation(summary = "Obtenir le nombre d'abonnés pour un contenu spécifique")
    public Mono<ResponseEntity<Long>> getSubscriptionCount(@PathVariable UUID contentId) {
        return abonnementService.getSubscriptionCountForContent(contentId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/content/{contentId}/check")
    @Operation(summary = "Vérifier si un utilisateur est abonné à un contenu")
    public Mono<ResponseEntity<Boolean>> checkSubscription(
            @RequestHeader(value = "X-User-Id", required = true) UUID userId,
            @PathVariable UUID contentId) {
        return abonnementService.isSubscribed(userId, contentId)
                .map(ResponseEntity::ok);
    }
}
