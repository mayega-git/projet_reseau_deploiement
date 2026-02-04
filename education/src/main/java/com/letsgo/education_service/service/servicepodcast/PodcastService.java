package com.letsgo.education_service.service.servicepodcast;
 
import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;
import com.letsgo.education_service.dto.PodcastDTO.PodcastCreateDTO;
import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDto;
import com.letsgo.education_service.enums.ContentStatus;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.exception.PodcastNotFoundException;
import com.letsgo.education_service.exceptions.EntityNotFoundException;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.models.Podcast_entity;
import com.letsgo.education_service.repository.EducationCategoriesRepository;
import com.letsgo.education_service.repository.EducationTagRepository;
import com.letsgo.education_service.repository.PodcastRepository;
import com.letsgo.education_service.service.apiService.FileStorageService;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationService.EducationService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;


import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.UUID;
 
@Service
@Slf4j
@RequiredArgsConstructor

public class PodcastService {
 
    private WebClient webClient;

    private final EducationTagService educationTagService;

    private final EducationCategoryService educationCategoryService;

    private final MediaStorageService mediaStorageService;

    private final String location = "podcasts/media";

    private final PodcastRepository podcastRepository;

    private final EducationService educationService;

    private final RessourceService ressourceService;
    

  

    


    public Mono<Podcast_entity> createPodcast(PodcastCreateDTO createDTO, Mono<FilePart> audioFile, Mono<FilePart> coverFile) {
        System.out.println("INITIALISATION DE BASE DES PARAMETRES DU PODCAST");

        if (audioFile == null) {
            System.err.println("AUDIO MANQUANT : Le fichier audio est requis.");
            return Mono.error(new IllegalArgumentException("Le fichier audio est requis pour créer un podcast."));
        }

        Podcast_entity podcast = new Podcast_entity();
        podcast.setTitle(createDTO.getTitle());
        podcast.setDescription(createDTO.getDescription());
        podcast.setAuthorId(createDTO.getAuthorId());
        //podcast.setOrganisationId(String.valueOf(createDTO.getOrganisationId()));
        podcast.setContentType(ContentType.PODCAST);
        podcast.setStatus(ContentStatus.DRAFT);
        podcast.setDomain(Domain.valueOf(createDTO.getDomain().toUpperCase()));
        System.out.println("INITIALISATION DE BASE DES PARAMETRES");
        
        // Upload des fichiers
            Mono<MediaUploadResponse> coverMono = (coverFile != null)
                ? mediaStorageService.uploadFile(coverFile,location)
                .defaultIfEmpty(new MediaUploadResponse())
                .onErrorResume(error -> {
                        System.err.println("ERREUR upload cover: " + error.getMessage());
                        return Mono.just(new MediaUploadResponse()); 
                    })
                : Mono.just(new MediaUploadResponse());

            Mono<MediaUploadResponse> audioMono = (audioFile != null)
                ? mediaStorageService.uploadFile(audioFile,location)
                .defaultIfEmpty(new MediaUploadResponse())
                .onErrorResume(error -> {
                    System.err.println("ERREUR upload audio: " + error.getMessage());
                    return Mono.just(new MediaUploadResponse()); // Continuer avec une réponse vide
                })
                : Mono.just(new MediaUploadResponse());
        
        //sauvegarde
        return Mono.zip(audioMono, coverMono)
            .flatMap(tuple -> {
                MediaUploadResponse audioDto = tuple.getT1();
                MediaUploadResponse coverDto = tuple.getT2();

                return savePodcastWithMedia(podcast, audioDto, coverDto);
            })
            .doOnSuccess(savedPodcast -> log.info("Podcast créé avec succès: {}", savedPodcast.getId()))
            .doOnError(e -> log.error("Erreur lors de la création du podcast", e));
            
    }

    //sauvegarder le podcast avec les medias et definir le rssource Id
    private Mono<Podcast_entity> savePodcastWithMedia(
            Podcast_entity podcast,
            MediaUploadResponse audioDto,
            MediaUploadResponse coverDto) {
        
        boolean hasAudio = audioDto.getId() != null;
        boolean hasCover = coverDto.getId() != null;
        
        log.info(" Vérification médias - Audio: {}, Cover: {}", hasAudio, hasCover);
        
        // Configurer l'audio si présent
        if (hasAudio) {
            podcast.setAudioDuration(String.valueOf(audioDto.getSize()));
            log.info(" urlAudio: {}", audioDto.getId());
            log.info(" durationAudio: {}", audioDto.getSize());
        }
        
        // Sauvegarder la ressource si au moins un média existe
        if (hasAudio || hasCover) {
            log.info(" Appel savePodcastRessource (audio={}, cover={})", hasAudio, hasCover);
            return savePodcastWithRessource(podcast, coverDto, audioDto);
        } else {
            // Aucun média
            log.info("Aucun média, sauvegarde directe");
            return podcastRepository.save(podcast);
        }
    }

    private Mono<Podcast_entity> savePodcastWithRessource(
                Podcast_entity podcast,
                MediaUploadResponse coverDto,
                MediaUploadResponse audioDto) {
            
            return educationService.saveRessource(coverDto, audioDto)
                .doOnSuccess(id -> log.info(" Ressource créée: {}", id))
                .onErrorResume(e -> {
                    log.warn(" Échec saveBlogRessource, poursuite sans media", e);
                    return Mono.empty();
                })
                .flatMap(ressourceId -> {
                    podcast.setId_ressource(ressourceId);
                    log.info(" Ressource {} attachée au podcast", ressourceId);
                    return podcastRepository.save(podcast);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Sauvegarde sans ressource après échec");
                    return podcastRepository.save(podcast);
                }));
    }



    public Mono<Podcast_entity> getPodcastById(String id) {
        return podcastRepository.findById(UUID.fromString(id))
            .switchIfEmpty(Mono.error(new EntityNotFoundException("Podcast avec l'ID " + id + " non trouvé.")));
    }

    

    public Mono<Podcast_entity> publishPodcast(String id) {
         return podcastRepository.findById(UUID.fromString(id))
        .flatMap(podcast -> {
            podcast.setStatus(ContentStatus.PUBLISHED);
            podcast.setPublishedAt(LocalDateTime.now());
            return podcastRepository.save(podcast);
        });
    }


    public Mono<Podcast_entity> updatePodcast(String id, PodcastCreateDTO updateDTO) {
        System.out.println("UPDATE PODCAST SERVICE HIT 1");
        
        return podcastRepository.findById(UUID.fromString(id))
            .switchIfEmpty(Mono.error(new NoSuchElementException("Blog avec l'ID " + id + " non trouvé.")))
            .flatMap(podcast -> {
                System.out.println("Status du podcast : " + podcast.getStatus());
                if (podcast.getStatus() != ContentStatus.DRAFT) {
                    return Mono.error(new IllegalStateException("Seuls les blogs en statut DRAFT peuvent être mis à jour."));
                }

                podcast.setTitle(updateDTO.getTitle());
                podcast.setDescription(updateDTO.getDescription());
                podcast.setAuthorId(updateDTO.getAuthorId());
                podcast.setUpdatedAt(LocalDateTime.now());
                System.out.println("UPDATE PODCAST SERVICE HIT 2");
                return podcastRepository.save(podcast);
            }); 
    }

 
    
    public Mono<Boolean> deletePodcast(String id) {
        return podcastRepository.deleteById(UUID.fromString(id))
            .then(Mono.just(true))
            .defaultIfEmpty(false);
    }

    public Flux<String> getTagsByPodcast(UUID id) {
            return educationTagService.getTagsByEducation( id);
        }

    public Flux<Podcast_entity> getPodcastPublished(String status) {
            return podcastRepository.findByStatus(status);
    }

    public Flux<String> getCategoriesByBlogs(String id) {
            return educationCategoryService.getCategoriesByEducation(id);
    }

    

    public Mono<ResponseEntity<Flux<DataBuffer>>> getCoverImage(UUID idPodcast) {

            return podcastRepository.findById(idPodcast)
                .switchIfEmpty(Mono.error(new PodcastNotFoundException("Podcast introuvable: " + idPodcast)))
                .flatMap(podcast -> {
                    if (podcast.getId_ressource() == null) {
                        return Mono.error(new PodcastNotFoundException("Aucune ressource pour ce podcast"));
                    }
                    return ressourceService.getRessourceById(podcast.getId_ressource());
                })
                .map(ressource -> {
                    if (ressource.getCoverId() == null) {
                        throw new PodcastNotFoundException("Aucune cover id trouvée");
                    }
                    
                    // On prépare le flux de données
                    Flux<DataBuffer> stream = mediaStorageService.getFile(ressource.getCoverId());
                    
                    // On détermine le type MIME (PNG par défaut si null)
                    MediaType contentType =  ressource.getMimeType() != null ? MediaType.parseMediaType(ressource.getMimeType())  : MediaType.IMAGE_PNG;;

                    return ResponseEntity.ok()
                            .contentType(contentType)
                            .body(stream);
                })
                .doOnError(e -> log.error(" Erreur cover podcast {}: {}", idPodcast, e.getMessage()));
        }

        public Mono<ResponseEntity<Flux<DataBuffer>>> getAudioPodcast(UUID idPodcast) {

            return podcastRepository.findById(idPodcast)
                .switchIfEmpty(Mono.error(new PodcastNotFoundException("Podcast introuvable: " + idPodcast)))
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
                    MediaType contentType = ressource.getMimeType() != null ? MediaType.parseMediaType(ressource.getMimeType())  : MediaType.IMAGE_PNG;

                    return ResponseEntity.ok()
                            .contentType(contentType)
                            
                            .body(stream);
                })
                .doOnError(e -> log.error(" Erreur cover podcast {}: {}", idPodcast, e.getMessage()));
        }

    public Flux<Podcast_entity> getAllPodcast() {
        return podcastRepository.findAll();
    }

    public Flux<Podcast_entity> getTagsByBlogs(UUID fromString) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTagsByBlogs'");
    }




    




}
