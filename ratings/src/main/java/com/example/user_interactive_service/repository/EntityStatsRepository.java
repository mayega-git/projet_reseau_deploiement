package com.example.user_interactive_service.repository;

import com.example.user_interactive_service.models.EntityStats;

//import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

import java.util.UUID;

public interface EntityStatsRepository extends R2dbcRepository<EntityStats, UUID> {


}
