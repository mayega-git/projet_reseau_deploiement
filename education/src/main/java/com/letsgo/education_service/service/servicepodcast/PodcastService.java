package com.letsgo.education_service.service.servicepodcast;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.PodcastDTO.PodcastCreateDTO;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.models.Podcast_entity;
import com.letsgo.education_service.repository.PodcastRepository;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationService.AbstractEducationService;
import com.letsgo.education_service.service.educationService.EducationService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import reactor.core.publisher.Flux;

@Service
public class PodcastService extends AbstractEducationService<Podcast_entity, PodcastCreateDTO> {

    private final PodcastRepository podcastRepository;

    public PodcastService(
            PodcastRepository podcastRepository,
            MediaStorageService mediaStorageService,
            EducationService educationService,
            RessourceService ressourceService,
            EducationTagService educationTagService,
            EducationCategoryService educationCategoryService) {
        super(podcastRepository, mediaStorageService, educationService, ressourceService, educationTagService,
                educationCategoryService);
        this.podcastRepository = podcastRepository;
    }

    @Override
    protected Podcast_entity mapDtoToEntity(PodcastCreateDTO dto) {
        Podcast_entity podcast = new Podcast_entity();
        podcast.setTitle(dto.getTitle());
        podcast.setDescription(dto.getDescription());
        podcast.setAuthorId(dto.getAuthorId());
        podcast.setOrganisationId(dto.getOrganisationId());
        podcast.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Champs specifiques au Podcast
        podcast.setTranscript(dto.getTranscript());
        return podcast;
    }

    @Override
    protected void applyUpdateFields(Podcast_entity entity, PodcastCreateDTO dto) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setAuthorId(dto.getAuthorId());
        entity.setOrganisationId(dto.getOrganisationId());
        entity.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Mises a jour specifiques
        entity.setTranscript(dto.getTranscript());
    }

    @Override
    protected ContentType getContentType() {
        return ContentType.PODCAST;
    }

    @Override
    protected String getMediaLocation() {
        return "podcasts/media";
    }

    // Methodes purement specifiques au podcast statuts (similaire a ce qui est dans
    // Blog)
    public Flux<Podcast_entity> getPodcastPublished(String status) {
        return podcastRepository.findByStatus(status);
    }
}
