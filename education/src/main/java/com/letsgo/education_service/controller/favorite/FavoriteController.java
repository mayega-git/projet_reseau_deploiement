package com.letsgo.education_service.controller.favorite;

import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.models.Favorite;
import com.letsgo.education_service.service.favorite.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/education-service/education/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/toggle")
    @Operation(summary = "Ajouter ou supprimer un favori", description = "Permet à un utilisateur d'ajouter ou de retirer une entité de ses favoris.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Action enregistrée avec succès"),
            @ApiResponse(responseCode = "400", description = "Paramètres invalides")
    })
    public Mono<ResponseEntity<String>> toggleFavorite(
            @Parameter(description = "ID de l'utilisateur") @RequestParam String userId,
            @Parameter(description = "ID de l'entité à ajouter ou retirer des favoris") @RequestParam String entity_id,
            @Parameter(description = "Type de l'entité (ex: blog, podcast)") @RequestParam String entityType) {

        return favoriteService.toggleFavorite(UUID.fromString(userId), UUID.fromString(entity_id), entityType)
                .map(isFavorite -> ResponseEntity.ok(isFavorite ? "Ajouté aux favoris" : "Retiré des favoris"));
    }
 
    

    @GetMapping("/count/{entity_id}")
    @Operation(summary = "Obtenir le nombre total de favoris pour une entité", description = "Retourne le nombre total de fois où une entité a été ajoutée en favori.")
    @ApiResponse(responseCode = "200", description = "Nombre total de favoris récupéré avec succès")
    public Mono<ResponseEntity<Integer>> getFavoriteCountBlog(
            @Parameter(description = "ID de l'entité pour laquelle récupérer le nombre de favoris")
            @PathVariable String entity_id) {
        return favoriteService.getFavoriteCountBlog(UUID.fromString(entity_id))
                .map(count -> ResponseEntity.ok(count.intValue()));
    }

    /*@GetMapping("/count/{podcast_id}")
    @Operation(summary = "Obtenir le nombre total de favoris pour une entité", description = "Retourne le nombre total de fois où une entité a été ajoutée en favori.")
    @ApiResponse(responseCode = "200", description = "Nombre total de favoris récupéré avec succès")
    public Mono<ResponseEntity<Integer>> getFavoriteCountPodcast(
            @Parameter(description = "ID de l'entité pour laquelle récupérer le nombre de favoris")
            @PathVariable String podcast_id) {
        return favoriteService.getFavoriteCountPodcast(podcast_id)
                .map(count -> ResponseEntity.ok(count.intValue()));
    }*/
 
    @GetMapping("/all")
    @Operation(summary = "Obtenir tous les favoris", description = "Récupère tous les favoris enregistrés.")
    @ApiResponse(responseCode = "200", description = "Liste des favoris récupérée avec succès")
    public Mono<ResponseEntity<List<Favorite>>> getAllFavorites() {
        return favoriteService.getAllFavorites()
                .collectList()
                .map(ResponseEntity::ok);
    }
 
    @GetMapping("/{userId}")
    @Operation(summary = "Récupérer les favoris d'un utilisateur",
            description = "Retourne la liste des favoris associés à l'ID utilisateur fourni")
    @ApiResponse(responseCode = "200", description = "Liste des favoris récupérée avec succès")
    public Mono<ResponseEntity<List<Favorite>>> getFavoritesByUserId(
            @Parameter(description = "Identifiant de l'utilisateur", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String userId) {
        return favoriteService.getFavoritesByUserId(UUID.fromString(userId))
                .collectList()
                .map(ResponseEntity::ok);
    }

}
