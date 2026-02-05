package com.example.newsletter_service.controllers;

import com.example.newsletter_service.dto.CategorieRequest;
import com.example.newsletter_service.dto.CategorieResponse;
import com.example.newsletter_service.services.CategorieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/education-service/newsletter/categorie")
@RequiredArgsConstructor
public class NewsletterCategorieController {

    private final CategorieService categorieService;

    /**
     * GET /api/categorie
     * Récupère toutes les catégories (accessible à tous)
     */
    @GetMapping
    public Flux<CategorieResponse> getAllCategories() {
        return categorieService.getAllCategories();
    }
    
    /**
     * GET /api/categorie/{id}
     * Récupère une catégorie par son ID
     */
    @GetMapping("/{id}")
    public Mono<CategorieResponse> getCategorieById(@PathVariable UUID id) {
        return categorieService.getCategorieById(id);
    }
    
    /**
     * GET /api/categorie/nom/{nom}
     * Récupère une catégorie par son nom
     */
    @GetMapping("/nom/{nom}")
    public Mono<CategorieResponse> getCategorieByNom(@PathVariable String nom) {
        return categorieService.getCategorieByNom(nom);
    }
    
    /**
     * POST /api/categorie
     * Crée une nouvelle catégorie (ADMIN uniquement)
     * Crée automatiquement le topic Kafka associé
     */
    @PostMapping  // FIXED - removed "/api/categorie"
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CategorieResponse> createCategorie(
            @Valid @RequestBody CategorieRequest request) {

                System.out.println("createCategorie :"+request);
        return categorieService.createCategorie(request);
    }
    
    /**
     * PUT /api/categorie/{id}
     * Met à jour la description d'une catégorie (ADMIN uniquement)
     */
    @PutMapping("/{id}")
    public Mono<CategorieResponse> updateCategorie(
            @PathVariable UUID id,
            @RequestParam String description) {
        return categorieService.updateCategorie(id, description);
    }
    
    /**
     * DELETE /api/categorie/{id}
     * Supprime une catégorie (ADMIN uniquement)
     * ATTENTION: Supprime aussi tous les abonnements liés
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteCategorie(@PathVariable UUID id) {
        return categorieService.deleteCategorie(id);
    }
}