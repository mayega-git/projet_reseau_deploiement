package com.letsgo.education_service.service.blogservice;

import com.letsgo.education_service.config.PingAPI;
import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;
import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDto;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDtoDownload;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.exception.BlogNotFoundException;
import com.letsgo.education_service.exception.PodcastNotFoundException;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.repository.BlogRepository;
import com.letsgo.education_service.service.apiService.FileStorageService;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationService.EducationService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.letsgo.education_service.enums.ContentStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Query;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;

import org.springframework.data.relational.core.query.Criteria;
import java.time.LocalDateTime;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor

public class BlogService {

    private final BlogRepository blogRepository;

    private final RessourceService ressourceService;

    private final EducationCategoryService educationCategoryService;

    private final EducationTagService educationTagService;

    private final String location = "blogs/media";

    @Qualifier("educationEntityTemplate")
    private final R2dbcEntityTemplate r2dbcEntityTemplate;

    private final MediaStorageService mediaStorageService;

    private final EducationService educationService;

    /**
     * Creation d'un blog
     */
    public Mono<Blog_entity> createBlog(BlogCreateDTO createDTO, Mono<FilePart> audioFile, Mono<FilePart> coverFile) {
        System.out.println("================liste Tags=============" + createDTO.getTags());
        System.out.println("================liste categories=============" + createDTO.getCategories());

        // Initialisation de blog
        Blog_entity blog = new Blog_entity();
        blog.setTitle(createDTO.getTitle());
        blog.setContent(createDTO.getContent());
        blog.setDescription(createDTO.getDescription());
        blog.setAuthorId(createDTO.getAuthorId());
        blog.setReadingTime(createDTO.getReadingTime());
        blog.setDomain(Domain.valueOf(createDTO.getDomain().toUpperCase()));
        blog.setContentType(ContentType.BLOG);
        blog.setStatus(ContentStatus.DRAFT);
        // System.out.println("================id plateforme=============" +
        // createDTO.getPlateformeId());
        // blog.setPlateformeId(createDTO.getPlateformeId());

        // Upload des fichiers
        Mono<MediaUploadResponse> coverMono = (coverFile != null)
                ? mediaStorageService.uploadFile(coverFile, location)
                        .defaultIfEmpty(new MediaUploadResponse())
                        .onErrorResume(error -> {
                            System.err.println("ERREUR upload cover: " + error.getMessage());
                            return Mono.just(new MediaUploadResponse());
                        })
                : Mono.just(new MediaUploadResponse());

        Mono<MediaUploadResponse> audioMono = (audioFile != null)
                ? mediaStorageService.uploadFile(audioFile, location)
                        .defaultIfEmpty(new MediaUploadResponse())
                        .onErrorResume(error -> {
                            System.err.println("ERREUR upload audio: " + error.getMessage());
                            return Mono.just(new MediaUploadResponse()); // Continuer avec une réponse vide
                        })
                : Mono.just(new MediaUploadResponse());

        // log.info(" Lancement Mono.zip...");
        // sauvegarde
        return Mono.zip(audioMono, coverMono)
                .flatMap(tuple -> {
                    // log.info("DANS FLATMAP APRÈS ZIP");
                    MediaUploadResponse audioDto = tuple.getT1();
                    MediaUploadResponse coverDto = tuple.getT2();

                    return saveBlogWithMedia(blog, audioDto, coverDto);
                })

                .flatMap(savedBlog -> educationService.saveTagsAndCategories(savedBlog, createDTO))
                .doOnSuccess(blog1 -> log.info(" Blog créé avec succès: {}", blog1.getId()))
                .doOnError(e -> log.error("Erreur création blog: {}", e.getMessage(), e));
    }

    private Mono<Blog_entity> saveBlogWithRessource(
            Blog_entity blog,
            MediaUploadResponse coverDto,
            MediaUploadResponse audioDto) {

        return educationService.saveRessource(coverDto, audioDto)
                .doOnSuccess(id -> log.info(" Ressource créée: {}", id))
                .onErrorResume(e -> {
                    log.warn(" Échec saveBlogRessource, poursuite sans media", e);
                    return Mono.empty();
                })
                .flatMap(ressourceId -> {
                    blog.setId_ressource(ressourceId);
                    log.info(" Ressource {} attachée au blog", ressourceId);
                    return blogRepository.save(blog);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Sauvegarde sans ressource après échec");
                    return blogRepository.save(blog);
                }));
    }

    // sauvegarder le blog avec les medias et definir le rssource Id
    private Mono<Blog_entity> saveBlogWithMedia(
            Blog_entity blog,
            MediaUploadResponse audioDto,
            MediaUploadResponse coverDto) {

        boolean hasAudio = audioDto.getId() != null;
        boolean hasCover = coverDto.getId() != null;

        log.info(" Vérification médias - Audio: {}, Cover: {}", hasAudio, hasCover);

        // Configurer l'audio si présent
        if (hasAudio) {
            blog.setAudioDuration(String.valueOf(audioDto.getSize()));
            log.info(" urlAudio: {}", audioDto.getId());
            log.info(" durationAudio: {}", audioDto.getSize());
        }

        // Sauvegarder la ressource si au moins un média existe
        if (hasAudio || hasCover) {
            log.info(" Appel saveBlogRessource (audio={}, cover={})", hasAudio, hasCover);
            return saveBlogWithRessource(blog, coverDto, audioDto);
        } else {
            // Aucun média
            log.info("Aucun média, sauvegarde directe");
            return blogRepository.save(blog);
        }
    }

    public Mono<Blog_entity> getBlogById(String id) {
        return blogRepository.findById(UUID.fromString(id))
                .switchIfEmpty(Mono.error(new BlogNotFoundException("Blog avec l'ID " + id + " non trouvé.")));
    }

    public Flux<Blog_entity> getAllBlog() {

        return blogRepository.findAll();
    }

    public Mono<Blog_entity> publishBlog(String id) {
        return blogRepository.findById(UUID.fromString(id))
                .flatMap(blog -> {
                    blog.setStatus(ContentStatus.PUBLISHED);
                    blog.setPublishedAt(LocalDateTime.now());
                    return blogRepository.save(blog);
                });
        // Si le blog n'est pas trouve, le Mono sera vide.
    }

    public Mono<Blog_entity> updateBlog(String id, BlogCreateDTO updateDTO) {
        return blogRepository.findById(UUID.fromString(id))
                .switchIfEmpty(Mono.error(new NoSuchElementException("Blog avec l'ID " + id + " non trouvé.")))
                .flatMap(blog -> {
                    if (blog.getStatus() != ContentStatus.DRAFT) {
                        return Mono.error(
                                new IllegalStateException("Seuls les blogs en statut DRAFT peuvent être mis à jour."));
                    }

                    blog.setTitle(updateDTO.getTitle());
                    blog.setDescription(updateDTO.getDescription());
                    blog.setAuthorId(updateDTO.getAuthorId());
                    blog.setContent(updateDTO.getContent());
                    blog.setReadingTime(updateDTO.getReadingTime());
                    blog.setDomain(Domain.valueOf(updateDTO.getDomain().toUpperCase()));
                    blog.setUpdatedAt(LocalDateTime.now());

                    return blogRepository.save(blog);
                });
    }

    public Mono<Boolean> archiveBlog(String id) {
        return blogRepository.findById(UUID.fromString(id))
                .flatMap(blog -> {
                    if (blog.getStatus() != ContentStatus.ARCHIVED) {
                        blog.setStatus(ContentStatus.ARCHIVED);
                        blog.setUpdatedAt(LocalDateTime.now());
                        return blogRepository.save(blog).thenReturn(true);
                    } else {
                        return Mono.just(false);
                    }
                });
    }

    /*
     * public Mono<Boolean> deleteBlog(String id) {
     * return blogRepository.findById(UUID.fromString(id))
     * .flatMap(blog -> {
     * ressourceService.getRessourceById(blog.getId_ressource())
     * .flatMap(ressource -> {
     * mediaStorageService.deleteFile(ressource.getCoverId());
     * 
     * })
     * .then(ressourceService.deleteRessource(ressource.getId()))
     * .then(blogRepository.deleteById(UUID.fromString(id)))
     * )
     * 
     * .then(Mono.just(true))
     * .defaultIfEmpty(false);
     * }
     */

    public Flux<String> getTagsByBlogs(UUID id) {
        return educationTagService.getTagsByEducation(id);
    }

    public Flux<String> getCategoriesByBlogs(String id) {
        return educationCategoryService.getCategoriesByEducation(id);
    }

    public Flux<Blog_entity> getBlogPublished(String status) {
        return blogRepository.findByStatus(status);
    }

    public Mono<ResponseEntity<Flux<DataBuffer>>> getCoverImage(UUID idBlog) {

        return blogRepository.findById(idBlog)
                .switchIfEmpty(Mono.error(new BlogNotFoundException("Blog introuvable: " + idBlog)))
                .flatMap(blog -> {
                    if (blog.getId_ressource() == null) {
                        return Mono.error(new BlogNotFoundException("Aucune ressource pour ce blog"));
                    }
                    return ressourceService.getRessourceById(blog.getId_ressource());
                })
                .map(ressource -> {
                    if (ressource.getCoverId() == null) {
                        throw new BlogNotFoundException("Aucune cover id trouvée");
                    }

                    // On prépare le flux de données
                    Flux<DataBuffer> stream = mediaStorageService.getFile(ressource.getCoverId());

                    // On détermine le type MIME (PNG par défaut si null)
                    MediaType contentType = (ressource != null && ressource.getMimeType() != null)
                            ? MediaType.parseMediaType(ressource.getMimeType())
                            : MediaType.IMAGE_PNG;

                    return ResponseEntity.ok()
                            .contentType(contentType)
                            .body(stream);
                })
                .doOnError(e -> log.error(" Erreur cover blog {}: {}", idBlog, e.getMessage()));
    }

    public Mono<ResponseEntity<Flux<DataBuffer>>> getAudioPodcast(UUID idBlog) {

        return blogRepository.findById(idBlog)
                .switchIfEmpty(Mono.error(new PodcastNotFoundException("Podcast introuvable: " + idBlog)))
                .flatMap(podcast -> {
                    if (podcast.getId_ressource() == null) {
                        return Mono.error(new PodcastNotFoundException("Aucune ressource pour ce podcast"));
                    }
                    return ressourceService.getRessourceById(podcast.getId_ressource());
                })
                .map(ressource -> {
                    if (ressource.getAudioId() == null) {
                        throw new PodcastNotFoundException("Aucune audio id trouvée");
                    }

                    // On prépare le flux de données
                    Flux<DataBuffer> stream = mediaStorageService.getFile(ressource.getAudioId());

                    // On détermine le type MIME (PNG par défaut si null)
                    MediaType contentType = ressource.getMimeType() != null
                            ? MediaType.parseMediaType(ressource.getMimeType())
                            : MediaType.IMAGE_PNG;

                    return ResponseEntity.ok()
                            .contentType(contentType)

                            .body(stream);
                })
                .doOnError(e -> log.error(" Erreur cover podcast {}: {}", idBlog, e.getMessage()));
    }

    public Mono<Blog_entity> updateStatusBlog(UUID id, String status) {
        return blogRepository.findById(id)
                .flatMap(blog -> {
                    if (blog.getStatus() != ContentStatus.ARCHIVED) {
                        blog.setStatus(ContentStatus.valueOf(status.toUpperCase()));
                        blog.setUpdatedAt(LocalDateTime.now());
                        return blogRepository.save(blog);
                    } else {
                        return Mono.just(new Blog_entity());
                    }
                });
    }

    public Mono<Integer> getBlogCountByAuthor(UUID authorId){
        return blogRepository.countBlogByAuthor(authorId);
    }

}
