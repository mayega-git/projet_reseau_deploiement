package com.example.user_interactive_service.repository;

import com.example.user_interactive_service.models.CommentReply;

import reactor.core.publisher.Flux;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

import java.util.UUID;

public interface CommentReplyRepository extends R2dbcRepository<CommentReply, UUID> {
    
    Flux<CommentReply> findByCommentId(UUID commentId);

}
