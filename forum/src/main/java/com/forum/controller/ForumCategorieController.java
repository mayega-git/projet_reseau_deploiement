package com.forum.controller;

import com.forum.model.Categorie;
import com.forum.service.ForumCategorieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/education-service/forum/categories")
public class ForumCategorieController {

    private final ForumCategorieService categorieService;

    public ForumCategorieController(ForumCategorieService categorieService) {
        this.categorieService = categorieService;
    }

    // 🔹 Créer une catégorie
    @PostMapping("/{groupeId}")
    public Mono<ResponseEntity<Object>> createCategorie(@PathVariable("groupeId") UUID groupeId, @RequestBody Categorie categorie) {
        System.out.println("groupeId: " + groupeId);
        System.out.println("Received categorie: " + categorie);
        System.out.println("Path groupeId: " + groupeId);
        return categorieService.createCategorie(groupeId, categorie)
                .map(cat -> ResponseEntity.ok((Object) cat))
                .onErrorResume(IllegalStateException.class, e -> Mono.just(ResponseEntity.status(409).body(e.getMessage())))
                .onErrorResume(IllegalArgumentException.class, e -> Mono.just(ResponseEntity.badRequest().body(e.getMessage())))
                .onErrorResume(IllegalCallerException.class, e -> Mono.just(ResponseEntity.badRequest().body(e.getMessage())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body(e.getMessage())));
    }

    // 🔹 Récupérer toutes les catégories
     @GetMapping("/all")
    public ResponseEntity<Flux<Categorie>> getAllCategories() {
        try {
            return ResponseEntity.ok(categorieService.getAllCategories());
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    // 🔹 Récupérer une catégorie par ID
    @GetMapping("/{categorieId}")
    public Mono<ResponseEntity<Categorie>> getCategorieById(@PathVariable("categorieId") UUID categorieId) {
        return categorieService.getCategorieById(categorieId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).build()));
    }

    // 🔹 Récupérer les catégories d'un groupe
    @GetMapping("/groupe/{groupeId}")
    public Flux<Categorie> getCategoriesByGroupeId(@PathVariable("groupeId") UUID groupeId) {
        return categorieService.getCategoriesByGroupeId(groupeId);
    }

    // 🔹 Mettre à jour une catégorie
    @PutMapping("/{categorieId}")
    public Mono<ResponseEntity<Categorie>> updateCategorie(@PathVariable("categorieId") UUID categorieId, @RequestBody Categorie categorie) {
        return categorieService.updateCategorie(categorieId, categorie)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).build()));
    }

    // 🔹 Supprimer une catégorie
    @DeleteMapping("/{categorieId}")
    public Mono<ResponseEntity<?>> deleteCategorie(@PathVariable("categorieId") UUID categorieId) {
        return categorieService.deleteCategorie(categorieId)
                .map(deleted -> deleted ? ResponseEntity.noContent().<Void>build() : ResponseEntity.notFound().build())
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }
}
