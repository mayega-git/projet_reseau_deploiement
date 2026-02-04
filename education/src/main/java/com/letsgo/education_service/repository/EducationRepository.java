package com.letsgo.education_service.repository;

import com.letsgo.education_service.models.Education_entity;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EducationRepository extends R2dbcRepository<Education_entity, UUID> {


}
