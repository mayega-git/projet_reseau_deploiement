package com.letsgo.education_service.service.educationService;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;

import com.letsgo.education_service.dto.EducationCreateDTO;
import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;
import com.letsgo.education_service.enums.ContentStatus;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.exception.EntityNotFoundException;
import com.letsgo.education_service.models.Education_entity;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import com.letsgo.education_service.repository.EducationBaseRepository;

@Slf4j
public abstract class AbstractEducationService<T extends Education_entity & InterfaceEntity, D extends EducationCreateDTO> {

    protected final EducationBaseRepository<T> repository;
    protected final MediaStorageService mediaStorageService;
    protected final EducationService educationService;
    protected final RessourceService ressourceService;
    protected final EducationTagService educationTagService;
    protected final EducationCategoryService educationCategoryService;

    protected AbstractEducationService(
            EducationBaseRepository<T> repository,
            MediaStorageService mediaStorageService,
            EducationService educationService,
            RessourceService ressourceService,
            EducationTagService educationTagService,
            EducationCategoryService educationCategoryService) {
        this.repository = repository;
        this.mediaStorageService = mediaStorageService;
        this.educationService = educationService;
        this.ressourceService = ressourceService;
        this.educationTagService = educationTagService;
        this.educationCategoryService = educationCategoryService;
    }

    protected abstract T mapDtoToEntity(D dto);

    protected abstract void applyUpdateFields(T entity, D dto);

    protected abstract ContentType getContentType();

    protected abstract String getMediaLocation();

    public Mono<T> create(D createDTO, Mono<FilePart> audioFile, Mono<FilePart> coverFile) {
        T entity = mapDtoToEntity(createDTO);
        entity.setContentType(getContentType());
        entity.setStatus(ContentStatus.DRAFT);

        Mono<MediaUploadResponse> coverMono;
        try {
            coverMono = (coverFile != null)
                    ? mediaStorageService.uploadFile(coverFile, getMediaLocation())
                            .defaultIfEmpty(new MediaUploadResponse())
                            .onErrorResume(error -> {
                                log.error("ERREUR upload cover dans flux: {}", error.getMessage());
                                return Mono.just(new MediaUploadResponse());
                            })
                    : Mono.just(new MediaUploadResponse());
        } catch (Exception e) {
            log.error("Exception bloquante lors de l'accès au coverFile, on l'ignore: {}", e.getMessage());
            coverMono = Mono.just(new MediaUploadResponse());
        }

        Mono<MediaUploadResponse> audioMono;
        try {
            audioMono = (audioFile != null)
                    ? mediaStorageService.uploadFile(audioFile, getMediaLocation())
                            .defaultIfEmpty(new MediaUploadResponse())
                            .onErrorResume(error -> {
                                log.error("ERREUR upload audio dans flux: {}", error.getMessage());
                                return Mono.just(new MediaUploadResponse());
                            })
                    : Mono.just(new MediaUploadResponse());
        } catch (Exception e) {
            log.error("Exception bloquante lors de l'accès au audioFile, on l'ignore: {}", e.getMessage());
            audioMono = Mono.just(new MediaUploadResponse());
        }

        return Mono.zip(audioMono, coverMono)
                .flatMap(tuple -> {
                    MediaUploadResponse audioDto = tuple.getT1();
                    MediaUploadResponse coverDto = tuple.getT2();
                    return saveWithMedia(entity, audioDto, coverDto);
                })
                .flatMap(savedEntity -> educationService.saveTagsAndCategories(savedEntity, createDTO))
                .doOnSuccess(e -> log.info("{} créé avec succès: {}", getContentType(), e.getId()))
                .doOnError(e -> log.error("Erreur création {}: {}", getContentType(), e.getMessage(), e));
    }

    private Mono<T> saveWithMedia(T entity, MediaUploadResponse audioDto, MediaUploadResponse coverDto) {
        boolean hasAudio = audioDto.getId() != null;
        boolean hasCover = coverDto.getId() != null;

        if (hasAudio) {
            entity.setAudioDuration(String.valueOf(audioDto.getSize()));
        }

        if (hasAudio || hasCover) {
            return saveWithRessource(entity, coverDto, audioDto);
        } else {
            return repository.save(entity);
        }
    }

    private Mono<T> saveWithRessource(T entity, MediaUploadResponse coverDto, MediaUploadResponse audioDto) {
        return educationService.saveRessource(coverDto, audioDto)
                .doOnSuccess(id -> log.info("Ressource créée: {}", id))
                .onErrorResume(e -> {
                    log.warn("Échec saveRessource, poursuite sans media", e);
                    return Mono.empty();
                })
                .flatMap(ressourceId -> {
                    entity.setId_ressource(ressourceId);
                    return repository.save(entity);
                })
                .switchIfEmpty(Mono.defer(() -> repository.save(entity)));
    }

    public Mono<T> getById(String id) {
        return repository.findById(UUID.fromString(id))
                .switchIfEmpty(Mono
                        .error(new EntityNotFoundException(getContentType() + " avec l'ID " + id + " non trouvé.")));
    }

    public Flux<T> getAll(String authorId, String status) {
        if (authorId != null && status != null) {
            return repository.findByAuthorIdAndStatus(UUID.fromString(authorId),
                    ContentStatus.valueOf(status.toUpperCase()));
        } else if (authorId != null) {
            return repository.findByAuthorId(UUID.fromString(authorId));
        } else if (status != null) {
            return repository.findByStatus(ContentStatus.valueOf(status.toUpperCase()));
        } else {
            return repository.findAll();
        }
    }

    public Mono<T> publish(String id) {
        return repository.findById(UUID.fromString(id))
                .flatMap(entity -> {
                    entity.setStatus(ContentStatus.PUBLISHED);
                    entity.setPublishedAt(LocalDateTime.now());
                    return repository.save(entity);
                });
    }

    public Mono<T> update(String id, D updateDTO) {
        return repository.findById(UUID.fromString(id))
                .switchIfEmpty(
                        Mono.error(new NoSuchElementException(getContentType() + " avec l'ID " + id + " non trouvé.")))
                .flatMap(entity -> {
                    if (entity.getStatus() != ContentStatus.DRAFT) {
                        return Mono
                                .error(new IllegalStateException("Seuls les statuts DRAFT peuvent être mis à jour."));
                    }
                    applyUpdateFields(entity, updateDTO);
                    entity.setUpdatedAt(LocalDateTime.now());
                    return repository.save(entity);
                });
    }

    public Mono<Boolean> archive(String id) {
        return repository.findById(UUID.fromString(id))
                .flatMap(entity -> {
                    if (entity.getStatus() != ContentStatus.ARCHIVED) {
                        entity.setStatus(ContentStatus.ARCHIVED);
                        entity.setUpdatedAt(LocalDateTime.now());
                        return repository.save(entity).thenReturn(true);
                    } else {
                        return Mono.just(false);
                    }
                });
    }

    public Mono<Boolean> delete(String id) {
        return repository.deleteById(UUID.fromString(id))
                .then(Mono.just(true))
                .defaultIfEmpty(false);
    }

    public Flux<String> getTags(UUID id) {
        return educationTagService.getTagsByEducation(id);
    }

    public Flux<String> getCategories(String id) {
        return educationCategoryService.getCategoriesByEducation(id);
    }

    public Mono<ResponseEntity<Flux<DataBuffer>>> getCoverImage(UUID idEntity) {
        return repository.findById(idEntity)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(getContentType() + " introuvable: " + idEntity)))
                .flatMap(entity -> {
                    if (entity.getId_ressource() == null) {
                        return Mono.error(new EntityNotFoundException("Aucune ressource pour ce " + getContentType()));
                    }
                    return ressourceService.getRessourceById(entity.getId_ressource());
                })
                .map(ressource -> {
                    if (ressource.getCoverId() == null) {
                        throw new EntityNotFoundException("Aucune cover id trouvée");
                    }
                    Flux<DataBuffer> stream = mediaStorageService.getFile(ressource.getCoverId());
                    MediaType contentType = (ressource.getMimeType() != null)
                            ? MediaType.parseMediaType(ressource.getMimeType())
                            : MediaType.IMAGE_PNG;

                    return ResponseEntity.ok().contentType(contentType).body(stream);
                });
    }

    public Mono<ResponseEntity<Flux<DataBuffer>>> getAudioFile(UUID idEntity) {
        return repository.findById(idEntity)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(getContentType() + " introuvable: " + idEntity)))
                .flatMap(entity -> {
                    if (entity.getId_ressource() == null) {
                        return Mono.error(new EntityNotFoundException("Aucune ressource pour ce " + getContentType()));
                    }
                    return ressourceService.getRessourceById(entity.getId_ressource());
                })
                .map(ressource -> {
                    if (ressource.getAudioId() == null) {
                        throw new EntityNotFoundException("Aucune audio id trouvée");
                    }
                    Flux<DataBuffer> stream = mediaStorageService.getFile(ressource.getAudioId());
                    MediaType contentType = (ressource.getMimeType() != null)
                            ? MediaType.parseMediaType(ressource.getMimeType())
                            : MediaType.IMAGE_PNG;

                    return ResponseEntity.ok().contentType(contentType).body(stream);
                });
    }

    public Mono<T> updateStatus(UUID id, String status) {
        return repository.findById(id)
                .flatMap(entity -> {
                    if (entity.getStatus() != ContentStatus.ARCHIVED) {
                        entity.setStatus(ContentStatus.valueOf(status.toUpperCase()));
                        entity.setUpdatedAt(LocalDateTime.now());
                        return repository.save(entity);
                    } else {
                        return Mono.empty();
                    }
                });
    }

    public Mono<Integer> getCountByAuthor(UUID authorId) {
        return repository.countByAuthorIdAndStatus(authorId, ContentStatus.PUBLISHED);
    }
}
