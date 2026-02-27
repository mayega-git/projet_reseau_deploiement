package com.letsgo.education_service.service.coursService;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.courseDto.CourseCreateDto;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.models.Course;
import com.letsgo.education_service.repository.courseRepository;
import com.letsgo.education_service.service.apiService.MediaStorageService;
import com.letsgo.education_service.service.educationCategoryService.EducationCategoryService;
import com.letsgo.education_service.service.educationService.AbstractEducationService;
import com.letsgo.education_service.service.educationService.EducationService;
import com.letsgo.education_service.service.educationTagService.EducationTagService;
import com.letsgo.education_service.service.ressourceService.RessourceService;

@Service
public class courseService extends AbstractEducationService<Course, CourseCreateDto> {

    public courseService(
            courseRepository coursRepository,
            MediaStorageService mediaStorageService,
            EducationService educationService,
            RessourceService ressourceService,
            EducationTagService educationTagService,
            EducationCategoryService educationCategoryService) {
        super(coursRepository, mediaStorageService, educationService, ressourceService, educationTagService,
                educationCategoryService);
    }

    @Override
    protected Course mapDtoToEntity(CourseCreateDto dto) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setAuthorId(dto.getAuthorId());
        course.setOrganisationId(dto.getOrganisationId());
        course.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Champs specifiques au Course
        course.setTrainerName(dto.getTrainerName());
        return course;
    }

    @Override
    protected void applyUpdateFields(Course entity, CourseCreateDto dto) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setAuthorId(dto.getAuthorId());
        entity.setOrganisationId(dto.getOrganisationId());
        entity.setDomain(Domain.valueOf(dto.getDomain().toUpperCase()));

        // Mises a jour specifiques
        entity.setTrainerName(dto.getTrainerName());
    }

    @Override
    protected ContentType getContentType() {
        return ContentType.COURSE;
    }

    @Override
    protected String getMediaLocation() {
        return "courses/media";
    }
}
