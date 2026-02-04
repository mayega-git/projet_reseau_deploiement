package com.letsgo.education_service.controller.controllerblog;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;
import com.letsgo.education_service.exception.BlogNotFoundException;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.service.apiService.FileStorageService;
import com.letsgo.education_service.service.blogservice.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/education-service/education/blogs")
public class BlogController {

    private final BlogService blogService;
    private final ObjectMapper objectMapper;

    @Autowired
    private final FileStorageService fileStorageService;

    @Autowired
    public BlogController(BlogService blogService, ObjectMapper objectMapper, FileStorageService fileStorageService) {
        this.blogService = blogService;
        this.objectMapper = objectMapper;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/test")
    public String getMethodName() {
        return new String("test");
    }

    // SpringWebFlux ne consomme pas les MultiPartFile
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer un blog avec des fichiers audio et une image de couverture optionnels✅")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Blog créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "415", description = "Type de contenu non supporté"),
            @ApiResponse(responseCode = "500", description = "Erreur serveur")
    })
    public Mono<ResponseEntity<Blog_entity>> createBlog(
            @RequestPart("data") String createBlogDto,
            @RequestPart(value = "audio", required = false) Mono<FilePart> audioFile,
            @RequestPart(value = "cover", required = false) Mono<FilePart> coverFile) {
        System.out.println("=== CRÉATION BLOG ===");
        System.out.println("JSON reçu : " + createBlogDto);
        System.out.println("Audio présent : " + audioFile.hasElement());
        System.out.println("Cover présent : " + coverFile.hasElement());

        return Mono.fromCallable(() -> {
            try {

                BlogCreateDTO createDTO = objectMapper.readValue(createBlogDto, BlogCreateDTO.class);
                System.out.println("DTO parsé : " + createDTO.getTitle());
                return createDTO;
            } catch (JsonProcessingException e) {
                System.err.println("Erreur parsing JSON : " + e.getMessage());
                throw new IllegalArgumentException("JSON invalide : " + e.getMessage());
            }
        })

                .flatMap(createDTO -> {
                    System.out.println("Appel du service...");
                    return blogService.createBlog(createDTO, audioFile, coverFile);
                })
                .map(blog -> {
                    System.out.println("Blog créé : " + blog.getId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(blog);
                })

                .onErrorResume(IllegalArgumentException.class, e -> {
                    System.err.println(" Erreur validation : " + e.getMessage());
                    Blog_entity errorBlog = createErrorBlog("Erreur de validation", e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(errorBlog));
                })
                .onErrorResume(Exception.class, e -> {
                    System.err.println(" Erreur serveur : " + e.getMessage());
                    e.printStackTrace();
                    Blog_entity errorBlog = createErrorBlog("Erreur serveur", "Une erreur interne s'est produite");
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBlog));
                });
    }

    // utilitaire pour formatage de l'erreur
    private Blog_entity createErrorBlog(String title, String description) {
        Blog_entity errorBlog = new Blog_entity();
        errorBlog.setTitle(title);
        errorBlog.setDescription(description);
        return errorBlog;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un blog par son Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "400", description = "Mauvaise requête")
    })
    public Mono<ResponseEntity<Blog_entity>> getBlogById(@PathVariable("id") String id) {
        return blogService.getBlogById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/published")
    @Operation(summary = "Obtenir tous les blogs avec des paramètres optionnels")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Id non trouvé")
    })
    public Flux<?> getAllBlogs(

            @RequestParam(name = "status", required = true) String status) {

        System.out.println(">>> REQUÊTE REÇUE - getAllBlogs avec status: '" + status + "'");

        return blogService.getBlogPublished(status);
    }

    @GetMapping
    @Operation(summary = "Obtenir tous les blogs ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Id non trouvé")
    })
    public Flux<Blog_entity> getAllBlogs() {

        return blogService.getAllBlog();
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publier un blog en utilisant son Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Id non trouvé")
    })
    public Mono<ResponseEntity<Blog_entity>> publishBlog(@PathVariable("id") String id) {
        return blogService.publishBlog(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Modifier un blog en utilisant l'Id du blog concerné")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succès"),
            @ApiResponse(responseCode = "404", description = "Id non trouvé")
    })
    public Mono<ResponseEntity<Blog_entity>> updateBlog(
            @PathVariable String id,
            @Valid @RequestBody BlogCreateDTO updateDTO) {

        return blogService.updateBlog(id, updateDTO)
                .map(ResponseEntity::ok)
                .onErrorResume(NoSuchElementException.class, e -> Mono.just(ResponseEntity.notFound().build()))
                .onErrorResume(ResponseStatusException.class, e -> Mono.error(e))
                .onErrorResume(Exception.class,
                        e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));

    }

    @GetMapping("/{idBlog}/coverblog")
    public Mono<ResponseEntity<Flux<DataBuffer>>> cover(@PathVariable("idBlog") UUID idBlog) {
        System.out.println("=====BLOG SERVICE - GET COVER IMAGE ========");

        return blogService.getCoverImage(idBlog)
                .map(file -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(file.getHeaders().getContentType().toString()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(file.getBody()));
    }

    @GetMapping("/{idBlog}/blogpodcast")
    public Mono<ResponseEntity<Flux<DataBuffer>>> audio(@PathVariable UUID idPodcast) {
        System.out.println("=====PODCAST SERVICE - GET AUDIO IMAGE =======");

        return blogService.getAudioPodcast(idPodcast)
                .map(file -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(file.getHeaders().getContentType().toString()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(file.getBody()));
    }

    @GetMapping(value = "/{idblogs}/tags", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getTagsByBlogs(@PathVariable String idblogs) {
        return blogService.getTagsByBlogs(UUID.fromString(idblogs)).collectList();
    }

    @GetMapping(value = "/{idblogs}/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getCategoriesByBlogs(@PathVariable String idblogs) {
        return blogService.getTagsByBlogs(UUID.fromString(idblogs)).collectList();
    }

    @PatchMapping("/{id}/archive")
    @Operation(summary = "Supprimer un blog par son Id (l'action de suppression est traitée comme une archive)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Blog supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Blog non trouvé"),
            @ApiResponse(responseCode = "400", description = "Le blog est déjà supprimé")
    })
    public Mono<ResponseEntity<Void>> deleteBlog(@PathVariable String id) {
        return blogService.archiveBlog(id)
                .map(isArchived -> isArchived
                        ? ResponseEntity.ok().<Void>build()
                        : ResponseEntity.status(HttpStatus.BAD_REQUEST).<Void>build())
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("count-by-author/{id}")
    @Operation(summary = "Nombre de blog par auteur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = " succès"),

    })
    public Mono<Integer> getBlogCountByAuthor(@PathVariable("id") String authorId) {
        return blogService.getBlogCountByAuthor(UUID.fromString(authorId));
    }

    /*
     * @PutMapping("/{id}/audio")
     * 
     * @Operation(summary =
     * "Mettre à jour l'audio du blog ou ajouter un audio au blog")
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Audio du blog mis à jour avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Blog non trouvé"),
     * 
     * @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
     * })
     * public Mono<ResponseEntity<Blog_entity>> uploadAudio(
     * 
     * @PathVariable String id,
     * 
     * @RequestPart("audio") FilePart audioFile) {
     * 
     * return blogService.uploadAudio(id, audioFile)
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
     * @PutMapping("/{id}/cover-image")
     * 
     * @Operation(summary =
     * "Mettre à jour l'image de couverture du blog ou ajouter une image de couverture au blog"
     * )
     * 
     * @ApiResponses({
     * 
     * @ApiResponse(responseCode = "200", description =
     * "Image mise à jour avec succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Image non trouvée"),
     * 
     * @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
     * })
     * public Mono<ResponseEntity<Blog_entity>> uploadCoverImg(
     * 
     * @PathVariable String id,
     * 
     * @RequestPart("cover") FilePart coverImage) {
     * 
     * return blogService.uploadCoverImage(id, coverImage)
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
     * @GetMapping("/filter")
     * 
     * @Operation(summary = "Obtenir tous les blogs avec des paramètres optionnels")
     * 
     * @ApiResponses(value = {
     * 
     * @ApiResponse(responseCode = "200", description = "Succès"),
     * 
     * @ApiResponse(responseCode = "404", description = "Id non trouvé")
     * })
     * public Flux<?> getAllBlogs(
     * 
     * @RequestParam(required = false) String title,
     * 
     * @RequestParam(required = false) String authorId,
     * 
     * @RequestParam(required = false) String status,
     * 
     * @RequestParam(required = false) String domain,
     * 
     * @RequestParam(required = false) List<String> categories,
     * 
     * @RequestParam(required = false) List<String> tags,
     * 
     * @RequestParam(required = false) String organisationId ) {
     * 
     * return blogService.getBlogByFilters(authorId, status, domain, categories,
     * tags, organisationId, title);
     * }
     */

}
