package com.example.user_interactive_service.service;

import com.example.user_interactive_service.dto.CommentDTO;
import com.example.user_interactive_service.models.Comment;
import com.example.user_interactive_service.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }
    //@AllowFiltering
    public Flux<Comment> getAllComments() {
        return commentRepository.findAll(); 
        //return Flux.fromIterable(comments);
    }

    public Mono<Comment> createComment(CommentDTO commentDTO) {
        Comment comment = new Comment(
                commentDTO.getContent(),
                commentDTO.getCommentByUser(),
                commentDTO.getEntityId(),
                commentDTO.getEntityType()
        );
        System.out.println("Comment created: \n" + comment.getEntityType());
        System.out.println("Comment created: \n" + comment.getEntityId());
        System.out.println("Comment created: \n"+ comment.getCommentByUser());

        return commentRepository.save(comment);
    }
    //@AllowFiltering
    public Flux<Comment> getCommentsByEntityId(UUID entityId) {
        return commentRepository.findByEntityId(entityId); 
        //return Flux.fromIterable(comments);
    }

    //@AllowFiltering
    public Mono<Void> deleteComment(UUID commentId) {
        return commentRepository.deleteById(commentId); // blocage
    }

    
}















/*package com.example.user_interactive_service.service;

import com.example.user_interactive_service.dto.CommentDTO;
import com.example.user_interactive_service.models.Comment;
import com.example.user_interactive_service.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private final CommentRepository commentRepository;


    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Optional<List<Comment>> getAllComments() {
        return Optional.of(commentRepository.findAll());
    }


    public Comment createComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setCommentByUser(commentDTO.getCommentByUser());
        comment.setEntityId(commentDTO.getEntityId());

        return commentRepository.save(comment);
    }

    public Optional<List<Comment>> getCommentsByEntityId(UUID entityId) {
        return Optional.ofNullable(commentRepository.findByEntityId(entityId));
    }




    public void deleteComment(UUID commentId) {
        commentRepository.deleteById(commentId);
    }
}*/
