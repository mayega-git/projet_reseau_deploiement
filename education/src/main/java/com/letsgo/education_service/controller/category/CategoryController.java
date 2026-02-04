package com.letsgo.education_service.controller.category;

import com.letsgo.education_service.dto.CategoryDTO.CategoryCreateDTO;
import com.letsgo.education_service.models.Category_entity;
import com.letsgo.education_service.service.category.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/education-service/education/categories")
public class CategoryController {

    @Autowired
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle catégorie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Catégorie créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public Mono<ResponseEntity<Category_entity>> createCategory(@RequestBody CategoryCreateDTO categoryCreateDTO) {
        Mono<Category_entity> categoryMono = categoryService.createCategory(categoryCreateDTO);
        return categoryMono
                .map(category -> ResponseEntity.status(HttpStatus.CREATED).body(category));
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "Mettre à jour une catégorie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie mise à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public Mono<ResponseEntity<Category_entity>> updateCategory(@PathVariable String categoryId,
            @RequestBody CategoryCreateDTO categoryCreateDTO) {

        Mono<Category_entity> updatedCategory = categoryService.updateCategory(categoryId, categoryCreateDTO);
        return updatedCategory.map(updCategory -> ResponseEntity.status(HttpStatus.OK).body(updCategory))
                .onErrorResume(RuntimeException.class, e -> {
                    return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
                });
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Obtenir une catégorie par son ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catégorie récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    })
    public Mono<ResponseEntity<Category_entity>> getCategoryById(@PathVariable String categoryId) {

        Mono<Category_entity> categoryMono = categoryService.getCategoryById(categoryId);
        return categoryMono.map(category -> ResponseEntity.status(HttpStatus.OK).body(category))
                .onErrorResume(RuntimeException.class, e -> {
                    return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
                });
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "Supprimer une catégorie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Catégorie supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    })
    public Mono<ResponseEntity<Void>> deleteCategory(@PathVariable String categoryId) {

        return categoryService.deleteCategory(categoryId)
                .then(Mono.just(new ResponseEntity<Void>(HttpStatus.NO_CONTENT)))
                .onErrorResume(RuntimeException.class, e -> Mono.just(new ResponseEntity<Void>(HttpStatus.NOT_FOUND)));

    }

    @Operation(summary = "Récupérer toutes les catégories")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des catégories récupérée avec succès"),
            @ApiResponse(responseCode = "500", description = "Erreur serveur lors de la récupération des catégories")
    })
    @GetMapping
    public Flux<Category_entity> getAllCategories() {

        return categoryService.getAllCategories()
                .onErrorResume(Exception.class, e -> {
                    return Flux.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Erreur serveur lors de la récupération des catégories", e));
                });
    }

    /*
     * @Autowired
     * private DatabaseClient databaseClient;
     * 
     * 
     * //Verifier la connexion
     * 
     * @GetMapping("/database-name")
     * public Mono<String> getCurrentDatabaseName() {
     * 
     * // PostgreSQL utilise la fonction current_database()
     * return databaseClient.sql("SELECT current_database()")
     * .map(row -> row.get(0, String.class))
     * .first() // Prend la première ligne du résultat (qui est la seule)
     * .defaultIfEmpty("Database name not found") // Équivalent de .orElse()
     * .onErrorResume(e -> Mono.just("Error connecting to database: " +
     * e.getMessage())); // Gestion d'erreur
     * }
     */

}
