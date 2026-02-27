package com.letsgo.education_service.service.educationService;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.EducationCreateDTO;
import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;
import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.repository.BlogRepository;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class EducationService {

    private final RessourceService ressourceService;

    private final EducationTagService educationTagService;

    private final EducationCategoryService educationCategoryService;

    // sauvergarder les informations lie aux ressources
    public Mono<UUID> saveRessource(MediaUploadResponse cover, MediaUploadResponse audio) {

        return ressourceService.saveRessource(cover, audio);

    }

    public <T extends InterfaceEntity> Mono<T> saveTagsAndCategories(T savedBlog, EducationCreateDTO createDTO) {
        log.info("Sauvegarde tags et catégories pour blog: {}", savedBlog.getId());

        Mono<Void> categoriesCompletion = educationCategoryService.saveEducationCategory(
                savedBlog.getId(),
                createDTO.getCategories());

        Mono<Void> tagCompletion = educationTagService.saveEducationTag(
                savedBlog.getId(),
                createDTO.getTags());

        return Mono.when(categoriesCompletion, tagCompletion)
                .then(Mono.just(savedBlog))
                .doOnSuccess(b -> log.info(" Tags et catégories sauvegardés pour blog: {}", b.getId()));
    }

}
