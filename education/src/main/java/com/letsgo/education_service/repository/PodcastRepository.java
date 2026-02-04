package com.letsgo.education_service.repository;

import com.letsgo.education_service.models.Podcast_entity;

import reactor.core.publisher.Flux;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface PodcastRepository extends R2dbcRepository<Podcast_entity, UUID> {

    Flux<Podcast_entity> findByStatus(String status);


}
