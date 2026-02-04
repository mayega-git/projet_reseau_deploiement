package com.letsgo.education_service.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import com.letsgo.education_service.models.Education_Category;

import reactor.core.publisher.Flux;


@Repository
public interface EducationCategoriesRepository extends R2dbcRepository<Education_Category, UUID> {

   @Query("""
    SELECT DISTINCT c.name
    FROM category_entity c
    JOIN education_category ec ON c.id = ec.id_category
    WHERE ec.id_blog = :id
    UNION
    SELECT DISTINCT c.name
    FROM category_entity c
    JOIN education_category ec ON c.id = ec.id_category
    WHERE ec.id_podcast = :id
    """)
    Flux<String> getCategoriesByEducation(UUID id);

    
}
