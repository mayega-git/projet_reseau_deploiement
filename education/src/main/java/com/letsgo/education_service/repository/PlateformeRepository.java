package com.letsgo.education_service.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import com.letsgo.education_service.models.Plateforme_entity;

@Repository
public interface PlateformeRepository extends R2dbcRepository<Plateforme_entity, UUID> {
    
}
