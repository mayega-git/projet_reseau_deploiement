package com.letsgo.education_service.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

import com.letsgo.education_service.models.Education_Tag;

import reactor.core.publisher.Flux;

public interface  EducationTagRepository extends R2dbcRepository<Education_Tag,UUID> {

    @Query("""
    SELECT DISTINCT t.name
    FROM tag_entity t
    JOIN education_tags et ON t.id = et.id_tag
    WHERE et.id_blog = :id
    UNION
    SELECT DISTINCT t.name
    FROM tag_entity t
    JOIN education_tags et ON t.id = et.id_tag
    WHERE et.id_podcast = :id
    """)
    Flux<String> getTagsByEducation(UUID id);
    
}
