package com.letsgo.education_service.repository;

import com.letsgo.education_service.models.Blog_entity;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends EducationBaseRepository<Blog_entity> {

    Flux<Blog_entity> findByStatus(String status);

}
