package com.example.newsletter_service.controllers;

import com.example.newsletter_service.dto.LecteurRegistrationRequest;
import com.example.newsletter_service.dto.SubscribeRequest;
import com.example.newsletter_service.dto.UpdateCategoriesRequest;
import com.example.newsletter_service.dto.LecteurResponse;
import com.example.newsletter_service.services.LecteurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/education-service/newsletter/lecteurs")
@RequiredArgsConstructor
public class LecteurControlleur {

    private final LecteurService lecteurService;

    /**
     * MODIFIÉ : Inscription SANS catégories
     * Le lecteur recevra TOUTES les newsletters par défaut
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<LecteurResponse> register(
            @Valid @RequestBody LecteurRegistrationRequest request) {
        return lecteurService.registerLecteur(request);
    }

    /**
     * NOUVEAU : S'abonner à des catégories (après inscription)
     * Une fois abonné, le lecteur ne recevra QUE ces catégories
     */
    @PostMapping("/{lecteurId}/subscribe")
    @ResponseStatus(HttpStatus.OK)
    public Mono<LecteurResponse> subscribeToCategories(
            @PathVariable UUID lecteurId,
            @Valid @RequestBody SubscribeRequest request) {
        return lecteurService.subscribeToCategories(lecteurId, request);
    }

    /**
     * Récupère les préférences d'un lecteur
     */
    @GetMapping("/{lecteurId}/preferences")
    public Mono<LecteurResponse> getPreferences(@PathVariable UUID lecteurId) {
        return lecteurService.getLecteurPreferences(lecteurId);
    }

    /**
     * Modifie les catégories d'abonnement
     */
    @PutMapping("/{lecteurId}/categories")
    public Mono<LecteurResponse> updateCategories(
            @PathVariable UUID lecteurId,
            @Valid @RequestBody UpdateCategoriesRequest request) {
        return lecteurService.updateCategories(lecteurId, request);
    }

    /**
     * NOUVEAU : Se désabonner de TOUTES les catégories
     * Après cela, le lecteur recevra à nouveau TOUTES les newsletters
     */
    @DeleteMapping("/{lecteurId}/categories")
    @ResponseStatus(HttpStatus.OK)
    public Mono<LecteurResponse> unsubscribeFromAllCategories(@PathVariable UUID lecteurId) {
        return lecteurService.unsubscribeFromAllCategories(lecteurId);
    }

    /**
     * Se désabonne d'une newsletter spécifique
     */
    @PostMapping("/{lecteurId}/unsubscribe/{newsletterId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> unsubscribeFromNewsletter(
            @PathVariable UUID lecteurId,
            @PathVariable UUID newsletterId) {
        return lecteurService.unsubscribeFromNewsletter(lecteurId, newsletterId);
    }

    /**
     * NOUVEAU : Vérifier si un lecteur existe
     */
    @GetMapping("/exists-by-email")
    public Mono<Boolean> checkLecteurExists(@RequestParam(name = "email") String email) {
        return lecteurService.checkIfLecteurExists(email);
    }
}
