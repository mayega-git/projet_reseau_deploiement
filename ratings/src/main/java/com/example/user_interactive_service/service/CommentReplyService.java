package com.example.user_interactive_service.service;

import com.example.user_interactive_service.dto.CommentReplyDTO;
import com.example.user_interactive_service.models.CommentReply;
import com.example.user_interactive_service.repository.CommentRepository;
import com.example.user_interactive_service.repository.CommentReplyRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentReplyService {

    private final CommentReplyRepository commentReplyRepository;
    private final CommentRepository commentRepository;

    public CommentReplyService(CommentReplyRepository commentReplyRepository, CommentRepository commentRepository) {
        this.commentReplyRepository = commentReplyRepository;
        this.commentRepository = commentRepository;
    }

    public Mono<CommentReply> createReply(CommentReplyDTO dto) {
        CommentReply reply = new CommentReply();

        Instant now = Instant.now();
        reply.setId(UUID.randomUUID()); //
        reply.setContent(dto.getContent());
        reply.setCommentId(dto.getCommentId());
        reply.setReplyByUserId(dto.getReplyByUserId());
        reply.setCreatedAt(now.atOffset(ZoneOffset.UTC));
        reply.setUpdatedAt(now.atOffset(ZoneOffset.UTC));
        reply.markNew(); // force insert even with non-null id

        return commentReplyRepository.save(reply);
    }

   
    public Mono<Void> deleteReply(UUID replyId) {
        return commentReplyRepository.findById(replyId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("La réponse avec l'ID spécifié n'existe pas.")))
                   //else 
                .flatMap(commentReply -> commentReplyRepository.delete(commentReply));
                
    }

    public Flux<CommentReply> getRepliesForComment(UUID commentId) {
        return commentReplyRepository.findByCommentId(commentId);
    }


    public Flux<CommentReply> getAllReplies() {
        return commentReplyRepository.findAll();
    }
}















