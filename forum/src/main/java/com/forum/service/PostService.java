package com.forum.service;

import com.forum.model.Post;
import com.forum.repository.PostRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import com.forum.dto.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final ForumCategorieService categorieService;
    private final CommentaireService commentaireService;

    public PostService(PostRepository postRepository, ForumCategorieService categorieService,
            CommentaireService commentaireService) {
        this.postRepository = postRepository;
        this.categorieService = categorieService;
        this.commentaireService = commentaireService;
    }

    public Mono<Post> createPost(Post post) {
        if (post.getGroupId() == null) {
            return Mono.error(new IllegalArgumentException("Le groupe du post est requis"));
        }
        if (post.getAuthorId() == null) {
            return Mono.error(new IllegalArgumentException("L'auteur du post est requis"));
        }
        if (post.getTitle() == null || post.getTitle().isBlank()) {
            return Mono.error(new IllegalArgumentException("Le titre du post est requis et ne peut pas être vide"));
        }
        if (post.getContent() == null || post.getContent().isBlank()) {
            return Mono.error(new IllegalArgumentException("Le contenu du post est requis et ne peut pas être vide"));
        }
        if (post.getCategoriesIds() == null || post.getCategoriesIds().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Au moins une catégorie est requise pour le post"));
        }

        post.setPostId(UUID.randomUUID());
        post.setCreationDate(Instant.now());
        post.markNew();
        post.setNumberOfDislikes(0);
        post.setNumberOfLikes(0);
        post.setPostDislikes(new ArrayList<>());
        post.setPostLikes(new ArrayList<>());

        return Flux.fromIterable(post.getCategoriesIds())
                .flatMap(categorieId -> categorieService.addPostToCategorie(categorieId, post.getPostId()).then())
                .then(postRepository.save(post));
    }

    // 🔹 Récupérer tous les posts
    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 🔹 Récupérer un post par son ID
    public Mono<Post> getPostById(UUID postId) {
        return postRepository.findById(postId);
    }

    // 🔹 Récupérer les posts d'un groupe
    public Flux<Post> getPostsByGroupeId(UUID groupeId) {
        return postRepository.findByGroupId(groupeId);
    }

    // 🔹 Récupérer les posts d'un auteur
    public Flux<Post> getPostsByAuteurId(UUID auteurId) {
        return postRepository.findByAuthorId(auteurId);
    }

    // 🔹 Récupérer les posts d'une catégorie
    public Flux<Post> getPostsByCategorieId(UUID categorieId) {
        return postRepository.findByCategorie(categorieId);
    }

    // 🔹 Mettre à jour un post
    public Mono<Post> updatePost(UUID postId, Post updatedPost) {
        return postRepository.findById(postId)
                .flatMap(existingPost -> {
                    if (updatedPost.getTitle() != null && !updatedPost.getTitle().isBlank()) {
                        existingPost.setTitle(updatedPost.getTitle());
                    }
                    if (updatedPost.getContent() != null && !updatedPost.getContent().isBlank()) {
                        existingPost.setContent(updatedPost.getContent());
                    }
                    if (updatedPost.getCategoriesIds() != null && !updatedPost.getCategoriesIds().isEmpty()) {
                        existingPost.setCategoriesIds(updatedPost.getCategoriesIds());
                    }
                    existingPost.setModificationDate(Instant.now());
                    return postRepository.save(existingPost);
                });
    }

    // 🔹 Supprimer un post
    public Mono<Boolean> deletePost(UUID postId) {
        return postRepository.findById(postId)
                .flatMap(post -> {
                    post.setSuppressionDate(Instant.now());
                    return postRepository.save(post).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }

    // 🔹 Ajouter un like à un post
    public Mono<Boolean> addLike(UUID postId, UUID memberId) {
        return postRepository.findById(postId)
                .flatMap(post -> {
                    if (post.getPostLikes() == null) {
                        post.setPostLikes(new ArrayList<>());
                    }
                    if (post.getPostLikes().contains(memberId)) {
                        return Mono.just(false); // L'utilisateur a déjà liké ce post
                    }
                    post.getPostLikes().add(memberId);
                    post.setNumberOfLikes(post.getNumberOfLikes() + 1);
                    return postRepository.save(post).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }

    // 🔹 Supprimer un like d'un post
    public Mono<Boolean> removeLike(UUID postId, UUID memberId) {
        return postRepository.findById(postId)
                .flatMap(post -> {
                    if (post.getPostLikes() == null) {
                        post.setPostLikes(new ArrayList<>());
                    }
                    if (!post.getPostLikes().contains(memberId)) {
                        return Mono.just(false); // L'utilisateur n'a pas liké ce post
                    }
                    post.getPostLikes().remove(memberId);
                    post.setNumberOfLikes(post.getNumberOfLikes() - 1);
                    return postRepository.save(post).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }

    // 🔹 Ajouter un dislike à un post
    public Mono<Boolean> addDislike(UUID postId, UUID memberId) {
        return postRepository.findById(postId)
                .flatMap(post -> {
                    if (post.getPostDislikes() == null) {
                        post.setPostDislikes(new ArrayList<>());
                    }
                    if (post.getPostDislikes().contains(memberId)) {
                        return Mono.just(false); // L'utilisateur a déjà disliké ce post
                    }
                    post.getPostDislikes().add(memberId);
                    post.setNumberOfDislikes(post.getNumberOfDislikes() + 1);
                    return postRepository.save(post).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }

    // 🔹 Supprimer un dislike d'un post
    public Mono<Boolean> removeDislike(UUID postId, UUID memberId) {
        return postRepository.findById(postId)
                .flatMap(post -> {
                    if (post.getPostDislikes() == null) {
                        post.setPostDislikes(new ArrayList<>());
                    }
                    if (!post.getPostDislikes().contains(memberId)) {
                        return Mono.just(false); // L'utilisateur n'a pas disliké ce post
                    }
                    post.getPostDislikes().remove(memberId);
                    post.setNumberOfDislikes(post.getNumberOfDislikes() - 1);
                    return postRepository.save(post).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }

    public void handleDeletedPost(Post post) {
        if (post.getSuppressionDate() != null) {
            post.setContent("Ce post a été supprimé");
        }
    }
public Mono<Post> toggleLike(UUID postId, UUID memberId) {
    return postRepository.findById(postId)
        .flatMap(post -> {

            if (post.getPostLikes() == null) {
                post.setPostLikes(new ArrayList<>());
            }
            if (post.getPostDislikes() == null) {
                post.setPostDislikes(new ArrayList<>());
            }

            int likes = post.getNumberOfLikes() == null ? 0 : post.getNumberOfLikes();
            int dislikes = post.getNumberOfDislikes() == null ? 0 : post.getNumberOfDislikes();

            if (post.getPostLikes().contains(memberId)) {
                // 🔁 UNLIKE
                post.getPostLikes().remove(memberId);
                post.setNumberOfLikes(likes - 1);
            } else {
                // 👍 LIKE
                post.getPostLikes().add(memberId);
                post.setNumberOfLikes(likes + 1);

                // ❌ retire le dislike si existant
                if (post.getPostDislikes().remove(memberId)) {
                    post.setNumberOfDislikes(dislikes - 1);
                }
            }

            return postRepository.save(post);
        });
}


public Mono<ReactionResponse> toggleDislike(UUID postId, UUID memberId) {
    return postRepository.findById(postId)
            .flatMap(post -> {

                if (post.getPostLikes() == null)
                    post.setPostLikes(new ArrayList<>());

                if (post.getPostDislikes() == null)
                    post.setPostDislikes(new ArrayList<>());

                // 🔁 Si déjà disliké → retirer
                if (post.getPostDislikes().contains(memberId)) {
                    post.getPostDislikes().remove(memberId);
                    post.setNumberOfDislikes(
                            Math.max(0, post.getNumberOfDislikes() - 1)
                    );
                } else {
                    // ➕ Ajouter dislike
                    post.getPostDislikes().add(memberId);
                    post.setNumberOfDislikes(post.getNumberOfDislikes() + 1);

                    // ❌ Retirer like si existant
                    if (post.getPostLikes().remove(memberId)) {
                        post.setNumberOfLikes(
                                Math.max(0, post.getNumberOfLikes() - 1)
                        );
                    }
                }

                return postRepository.save(post)
                        .map(saved -> new ReactionResponse(
                                saved.getNumberOfLikes(),
                                saved.getNumberOfDislikes()
                        ));
            });
}


    

}
