package com.letsgo.education_service.controller.controllerpodcast;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.letsgo.education_service.dto.PodcastDTO.PodcastCreateDTO;
import com.letsgo.education_service.enums.ContentStatus;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.exception.BlogNotFoundException;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.models.Podcast_entity;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.servicepodcast.PodcastService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/education-service/education/podcasts")
@RequiredArgsConstructor
public class PodcastController {

    private final PodcastService podcastService;
    private final ObjectMapper objectMapper;

    private final EducationCategoryService educationCategoryService;

    private final EducationTagService educationTagService;

    /*
     * 
     * @GetMapping
     * 
     * @Operation(summary = "Obtenir tous les blogs avec des paramètres optionnels")
     * 
     * @ApiResponses(value = {
     * 
     * @ApiResponse(responseCode = "200", description = "Succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Id non trouvé")
     * })
     * public Flux<?> getAllPodcasts(
     * 
     * @RequestParam(required = false) String title,
     * 
     * @RequestParam(required = false) String authorId,
     * 
     * @RequestParam(required = false) ContentStatus status,
     * 
     * @RequestParam(required = false) Domain domain,
     * 
     * @RequestParam(required = false) String categoryId,
     * 
     * @RequestParam(required = false) List<String> tags,
     * 
     * @RequestParam(required = false) String organisationId) {
     * 
     * return podcastService.getPodcastByFilters(authorId, status, domain,
     * categoryId, tags, organisationId, title);
     * }
     * 
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer un podcast avec un fichier audio et une image de couverture optionnelle")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Podcast créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "415", description = "Type de contenu non supporté")
    })
    public Mono<ResponseEntity<Podcast_entity>> createPodcast(
            @RequestPart("data") String createDTOJson,
            @RequestPart(value = "audio", required = false) Mono<FilePart> audioFile,
            @RequestPart(value = "cover", required = false) Mono<FilePart> coverFile) {
        System.out.println("=== CRÉATION PODCAST ===");
        System.out.println("JSON reçu : " + createDTOJson);
        System.out.println("Audio présent : " + audioFile.hasElement());
        System.out.println("Cover présent : " + coverFile.hasElement());

        return Mono.fromCallable(() -> {
            try {
                PodcastCreateDTO createDTO = objectMapper.readValue(createDTOJson, PodcastCreateDTO.class);
                System.out.println("DTO parsé : " + createDTO.getTitle());
                return createDTO;
            } catch (JsonProcessingException e) {
                System.err.println("Erreur parsing JSON : " + e.getMessage());
                throw new IllegalArgumentException("JSON invalide : " + e.getMessage());
            }
        })
                .flatMap(dto -> {
                    System.out.println("Appel du service PodcastService...");
                    return podcastService.create(dto, audioFile, coverFile);
                })
                .map(podcast -> {
                    System.out.println("Podcast créé : " + podcast.getId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(podcast);
                })
                .onErrorResume(IllegalArgumentException.class, e -> {
                    System.err.println("Erreur validation : " + e.getMessage());
                    Podcast_entity error = createErrorPodcast("Erreur de validation", e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(error));
                })
                .onErrorResume(Exception.class, e -> {
                    System.err.println("Erreur serveur : " + e.getMessage());
                    e.printStackTrace();
                    Podcast_entity error = createErrorPodcast("Erreur serveur", "Une erreur interne s'est produite");
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error));
                });
    }

    // Méthode utilitaire cohérente formatage de l'erreur
    private Podcast_entity createErrorPodcast(String title, String description) {
        Podcast_entity errorPodcast = new Podcast_entity();
        errorPodcast.setTitle(title);
        errorPodcast.setDescription(description);
        return errorPodcast;
    }

    @GetMapping
    @Operation(summary = "Obtenir tous les podcasts ✅ ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Id non trouvé")
    })
    public Flux<Podcast_entity> getAll(
            @RequestParam(name = "authorId", required = false) String authorId,
            @RequestParam(name = "status", required = false) String status) {
        return podcastService.getAll(authorId, status);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un podcast par son ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
    })
    public Mono<ResponseEntity<Podcast_entity>> getPodcastById(@PathVariable("id") String id) {
        return podcastService.getById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publier un podcast")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Podcast publié"),
            @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
    })
    public Mono<ResponseEntity<Podcast_entity>> publishBlog(@PathVariable("id") String id) {
        return podcastService.publish(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour un podcast")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Podcast mis à jour"),
            @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
    })
    public Mono<ResponseEntity<Podcast_entity>> updatePodcast(
            @PathVariable String id,
            @Valid @RequestBody PodcastCreateDTO updateDTO) {
        System.out.println("UPDATE PODCAST CONTROLLER HIT");
        return podcastService.update(id, updateDTO)
                .map(updatedBlog -> ResponseEntity.ok(updatedBlog))
                .onErrorResume(NoSuchElementException.class, e -> Mono.just(ResponseEntity.notFound().build()))
                .onErrorResume(IllegalStateException.class,
                        e -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build()));
    }

    @GetMapping("/{idPodcast}/coverpodcast")
    public Mono<ResponseEntity<Flux<DataBuffer>>> cover(@PathVariable("idPodcast") UUID idPodcast) {
        System.out.println("=====PODCAST SERVICE - GET COVER IMAGE ========");

        return podcastService.getCoverImage(idPodcast)
                .map(file -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(file.getHeaders().getContentType().toString()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(file.getBody()));
    }

    @GetMapping("/{idPodcast}/audiopodcast")
    public Mono<ResponseEntity<Flux<DataBuffer>>> audio(@PathVariable("idPodcast") UUID idPodcast) {
        System.out.println("=====PODCAST SERVICE - GET AUDIO IMAGE =======");

        return podcastService.getAudioFile(idPodcast)
                .map(file -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(file.getHeaders().getContentType().toString()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(file.getBody()));
    }

    @GetMapping(value = "/{idpodcast}/tags", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getTagsByBlogs(@PathVariable("idpodcast") String idpodcast) {
        return educationTagService.getTagsByEducation(UUID.fromString(idpodcast)).collectList();
    }

    @GetMapping(value = "/{idpodcast}/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getCategoriesByBlogs(@PathVariable("idpodcast") String idpodcast) {
        return educationCategoryService.getCategoriesByEducation(idpodcast).collectList();
    }

    @GetMapping("count-by-author/{id}")
    @Operation(summary = "Nombre de contenus par auteur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = " succès"),
    })
    public Mono<Integer> getCountByAuthor(@PathVariable("id") String authorId) {
        return podcastService.getCountByAuthor(UUID.fromString(authorId));
    }

    /*
     * 
     * @PutMapping("/{id}/cover")
     * 
     * @Operation(summary =
     * "Ajouter ou modifier une image de couverture pour un podcast")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Image ajoutée avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
     * })
     * public Mono<ResponseEntity<Podcast_entity>> uploadCoverImg(
     * 
     * @PathVariable String id,
     * 
     * @RequestPart("cover") FilePart coverImage) {
     * 
     * return podcastService.uploadCoverImage(id, coverImage)
     * .map(updatedBlog -> ResponseEntity.ok(updatedBlog))
     * .onErrorResume(e -> {
     * if (e instanceof BlogNotFoundException) {
     * return Mono.just(ResponseEntity.notFound().build());
     * } else if (e instanceof IllegalArgumentException) {
     * return Mono.just(ResponseEntity.badRequest().build());
     * } else {
     * return
     * Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
     * }
     * });
     * }
     * 
     * @PatchMapping("/{id}/delete")
     * 
     * @Operation(summary =
     * "Supprimer un podcast par son Id (l'action de suppression est traitée comme une archive)"
     * )
     * 
     * @ApiResponses(value = {
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Podcast supprimé avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé"),
     * 
     * @ApiResponse(responseCode = "400", description =
     * "Le podcast est déjà supprimé")
     * })
     * public Mono<ResponseEntity<Void>> archivePodcast(@PathVariable String id) {
     * return podcastService.deleteBlog(id)
     * .map(isArchived -> isArchived
     * ? ResponseEntity.ok().<Void>build()
     * : ResponseEntity.status(HttpStatus.BAD_REQUEST).<Void>build())
     * .defaultIfEmpty(ResponseEntity.notFound().build());
     * }
     * 
     * @GetMapping("/{id}/stream")
     * 
     * @Operation(summary = "Écouter un podcast en streaming")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description = "Lecture en cours"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
     * })
     * public Mono<ResponseEntity<Flux<DataBuffer>>> streamPodcast(@PathVariable
     * String podcastId) {
     * return podcastService.streamPodcast(podcastId)
     * .map(dataBufferFlux -> ResponseEntity.ok()
     * .contentType(MediaType.APPLICATION_OCTET_STREAM)
     * .body(dataBufferFlux)
     * )
     * .defaultIfEmpty(ResponseEntity.notFound().build());
     * }
     * 
     * 
     * @PutMapping("/{id}/uploadPodcast")
     * 
     * @Operation(summary = "Modifier  l'audio pour un podcast existant")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Podcast mis à jour avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
     * })
     * public Mono<ResponseEntity<Podcast_entity>> uploadPodcast(
     * 
     * @PathVariable String id,
     * 
     * @RequestPart("audio") FilePart audioFile) {
     * 
     * return podcastService.uploadPodcast(id, audioFile)
     * .map(updatedBlog -> ResponseEntity.ok(updatedBlog))
     * .onErrorResume(e -> {
     * if (e instanceof BlogNotFoundException) {
     * return Mono.just(ResponseEntity.notFound().build());
     * } else if (e instanceof IllegalArgumentException) {
     * return Mono.just(ResponseEntity.badRequest().build());
     * } else {
     * return
     * Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
     * }
     * });
     * }
     */

    /*
     * @PatchMapping("/{id}/uploadCover")
     * 
     * @Operation(summary =
     * "Uploader une image de couverture pour un podcast existant")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Image de couverture mise à jour avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé")
     * })
     * public Mono<ResponseEntity<Podcast_entity>> uploadCoverImg(
     * 
     * @PathVariable String id,
     * 
     * @RequestPart("cover") FilePart coverImage) {
     * 
     * return podcastService.uploadCoverImage(id, coverImage)
     * .map(updatedBlog -> ResponseEntity.ok(updatedBlog))
     * .onErrorResume(e -> {
     * if (e instanceof BlogNotFoundException) {
     * return Mono.just(ResponseEntity.notFound().build());
     * } else if (e instanceof IllegalArgumentException) {
     * return Mono.just(ResponseEntity.badRequest().build());
     * } else {
     * return
     * Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
     * }
     * });
     * }
     */

    /*
     * @GetMapping("/{id}/stream-coverImage")
     * 
     * @Operation(summary = "Écouter un podcast en streaming")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description = "Lecture en cours"),
     * 
     * @ApiResponse(responseCode = "404", description = "Podcast non trouvé"),
     * 
     * @ApiResponse(responseCode = "500", description= "Erreur interne du serveur")
     * })
     * public ResponseEntity<Flux<DataBuffer>> streamCoverImage(@PathVariable String
     * id) {
     * Flux<DataBuffer> flux = podcastService.streamCoverImage(id);
     * return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(flux);
     * }
     * 
     */
}
