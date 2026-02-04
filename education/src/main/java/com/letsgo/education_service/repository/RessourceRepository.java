package com.letsgo.education_service.repository;
import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;

import com.letsgo.education_service.models.Ressource_entity;

public interface RessourceRepository extends R2dbcRepository<Ressource_entity, UUID> {
    
}
