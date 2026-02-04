package com.example.user_interactive_service.repository;

import com.example.user_interactive_service.models.Comment;

import reactor.core.publisher.Flux;

import org.springframework.data.r2dbc.repository.R2dbcRepository;

import java.util.UUID;

public interface CommentRepository extends R2dbcRepository<Comment, UUID> {
    
    Flux<Comment> findByEntityId(UUID entityId);
}
