package com.letsgo.education_service.service.blogservice;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.models.Blog_entity;
import com.letsgo.education_service.repository.BlogRepository;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationService.AbstractEducationService;
import com.letsgo.education_service.service.educationService.EducationService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

import java.util.UUID;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BlogService extends AbstractEducationService<Blog_entity, BlogCreateDTO> {

    private final BlogRepository blogRepository;

    public BlogService(
            BlogRepository blogRepository,
            MediaStorageService mediaStorageService,
            EducationService educationService,
            RessourceService ressourceService,
            EducationTagService educationTagService,
            EducationCategoryService educationCategoryService) {
        super(blogRepository, mediaStorageService, educationService, ressourceService, educationTagService,
                educationCategoryService);
        this.blogRepository = blogRepository;
    }

    @Override
    protected Blog_entity mapDtoToEntity(BlogCreateDTO dto) {
        Blog_entity blog = new Blog_entity();
        blog.setTitle(dto.getTitle());
        blog.setDescription(dto.getDescription());
        blog.setAuthorId(dto.getAuthorId());
        blog.setOrganisationId(dto.getOrganisationId());
        blog.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Champs specifiques au Blog
        blog.setContent(dto.getContent());
        blog.setReadingTime(dto.getReadingTime());
        return blog;
    }

    @Override
    protected void applyUpdateFields(Blog_entity entity, BlogCreateDTO dto) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setAuthorId(dto.getAuthorId());
        entity.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Mises a jour specifiques
        entity.setContent(dto.getContent());
        entity.setReadingTime(dto.getReadingTime());
    }

    @Override
    protected ContentType getContentType() {
        return ContentType.BLOG;
    }

    @Override
    protected String getMediaLocation() {
        return "blogs/media";
    }

    // Methodes purement specifiques au blog qui ne sont pas dans l'abstrait
    public Flux<Blog_entity> getBlogPublished(String status) {
        return blogRepository.findByStatus(status);
    }
}
