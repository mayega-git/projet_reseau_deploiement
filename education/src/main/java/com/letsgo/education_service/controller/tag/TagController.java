package com.letsgo.education_service.controller.tag;

import com.letsgo.education_service.dto.TagDTO.TagCreateDTO;
import com.letsgo.education_service.models.Tag_entity;
import com.letsgo.education_service.service.tag.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/education-service/education/tags")
public class TagController {

        @Autowired
        private TagService tagService;

        @GetMapping
        @Operation(summary = "Récupérer tous les tags")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Liste des tags récupérée avec succès"),
                        @ApiResponse(responseCode = "500", description = "Erreur serveur lors de la récupération des tags")
        })
        public Mono<ResponseEntity<Flux<Tag_entity>>> getAllTags() {
                return Mono.just(ResponseEntity.ok(tagService.getAllTags()));
        }

        @PostMapping
        @Operation(summary = "Créer un nouveau tag ")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Tag créé avec succès"),
                        @ApiResponse(responseCode = "400", description = "Données invalides dans la requête")
        })
        public Mono<ResponseEntity<Tag_entity>> createTag(@RequestBody TagCreateDTO tagCreateDTO) {

                return tagService.createTag(tagCreateDTO)
                                .map(tag -> ResponseEntity.status(HttpStatus.CREATED).body(tag))
                                .onErrorResume(e -> Mono
                                                .just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)));
        }

        @GetMapping("/{tagId}")
        @Operation(summary = "Récupérer un tag par ID")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Tag récupéré avec succès"),
                        @ApiResponse(responseCode = "404", description = "Tag non trouvé avec l'ID spécifié")
        })
        public Mono<ResponseEntity<Tag_entity>> getTag(@PathVariable String tagId) {
                return tagService.getTagById(tagId)
                                .map(ResponseEntity::ok)
                                .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)));
        }

        @PutMapping("/{tagId}")
        @Operation(summary = "Mettre à jour un tag existant")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Tag mis à jour avec succès"),
                        @ApiResponse(responseCode = "400", description = "Données invalides dans la requête"),
                        @ApiResponse(responseCode = "404", description = "Tag non trouvé avec l'ID spécifié")
        })
        public Mono<ResponseEntity<Tag_entity>> updateTag(@PathVariable String tagId,
                        @RequestBody TagCreateDTO tagCreateDTO) {
                return tagService.updateTag(tagId, tagCreateDTO)
                                .map(tag -> ResponseEntity.status(HttpStatus.OK).body(tag))
                                .onErrorResume(e -> Mono
                                                .just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)));
        }

        /*
         * @DeleteMapping("/{tagId}")
         * 
         * @Operation(summary = "Supprimer un tag par ID")
         * 
         * @ApiResponses({
         * 
         * @ApiResponse(responseCode = "204", description = "Tag supprimé avec succès"),
         * 
         * @ApiResponse(responseCode = "404", description =
         * "Tag non trouvé avec l'ID spécifié")
         * })
         * public Mono<ResponseEntity<Void>> deleteTag(@PathVariable String tagId) {
         * return tagService.deleteTag(tagId)
         * .thenReturn(ResponseEntity.<Void>status(HttpStatus.NO_CONTENT).build())
         * .onErrorResume(e -> Mono.just(ResponseEntity.notFound().build()));
         * }
         */
}
