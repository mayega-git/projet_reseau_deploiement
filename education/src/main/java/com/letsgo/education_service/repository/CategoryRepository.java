package com.letsgo.education_service.repository;
import com.letsgo.education_service.models.Category_entity;

import reactor.core.publisher.Flux;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;


@Repository
public interface CategoryRepository extends R2dbcRepository<Category_entity, UUID> {

    Flux<Category_entity> findByNameIn(List<String> names);
}
