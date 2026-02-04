package com.forum.controller;

import com.forum.model.Post;
import com.forum.service.CommentaireService;
import com.forum.service.DiscussionGroupService;
import com.forum.service.PostService;
import com.forum.dto.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/education-service/forum/posts")
public class PostController {

    private final PostService postService;
    private final DiscussionGroupService discussionGroupService;
    private final CommentaireService commentaireService;

    public PostController(PostService postService, DiscussionGroupService discussionGroupService,
            CommentaireService commentaireService) {
        this.postService = postService;
        this.discussionGroupService = discussionGroupService;
        this.commentaireService = commentaireService;
    }


    @PostMapping
public Mono<ResponseEntity<Post>> createPost(@RequestBody Post post, @RequestParam String memberId) {
    System.out.println("Membre ID: " + memberId);
    System.out.println("GroupId reçu = " + post.getGroupId());

    // On retire la vérification 'isUserInCommunity' pour permettre à tout le monde de poster
    return postService.createPost(post)
            .map(ResponseEntity::ok)
            .onErrorResume(e -> {
                e.printStackTrace();
                return Mono.just(ResponseEntity.status(500).<Post>build());
            });
}

    /* 
    @PostMapping
    public Mono<ResponseEntity<Post>> createPost(@RequestBody Post post, @RequestParam UUID memberId) {
        System.out.println(memberId);
            System.out.println("GroupId reçu = " + post.getGroupId());

        return discussionGroupService.isUserInCommunity(post.getGroupId(), memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.createPost(post).map(ResponseEntity::ok);
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).<Post>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).<Post>build()));
    }*/

    // 🔹 Récupérer tous les posts
    /*
     * @GetMapping("/all")
     * public ResponseEntity<List<Post>> getAllPosts() {
     * try {
     * return ResponseEntity.ok(postService.getAllPosts());
     * } catch (Exception e) {
     * System.out.println(e.getMessage());
     * return ResponseEntity.status(500).body(null);
     * }
     * }
     */


    // 🔹 Récupérer un post par ID
    @GetMapping("/{postId}")
    public Mono<ResponseEntity<Post>> getPostById(@PathVariable("postId") UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.getPostById(postId)
                                .flatMap(post -> commentaireService.countDirectCommentairesByPost(postId)
                                        .map(count -> {
                                            postService.handleDeletedPost(post);
                                            post.setCommentCount(count);
                                            return ResponseEntity.ok(post);
                                        }))
                                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).<Post>build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Post>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).<Post>build()));
    }

    // 🔹 Récupérer les posts d'un groupe
    /*@GetMapping("/groupe/{groupeId}")
    public Mono<ResponseEntity<List<Post>>> getPostsByGroupeId(@PathVariable UUID groupeId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInCommunity(groupeId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.getPostsByGroupeId(groupeId)
                                .flatMap(post -> commentaireService.countDirectCommentairesByPost(post.getPostId())
                                        .map(count -> {
                                            postService.handleDeletedPost(post);
                                            post.setCommentCount(count);
                                            return post;
                                        }))
                                .collectList()
                                .map(ResponseEntity::ok);
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<List<Post>>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.<List<Post>>status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }*/

                @GetMapping("/groupe/{groupeId}")
public Mono<ResponseEntity<List<Post>>> getPostsByGroupeId(
        @PathVariable("groupeId") UUID groupeId
) {
    return postService.getPostsByGroupeId(groupeId)
            .flatMap(post ->
                    commentaireService.countDirectCommentairesByPost(post.getPostId())
                            .map(count -> {
                                postService.handleDeletedPost(post);
                                post.setCommentCount(count);
                                return post;
                            })
            )
            .collectList()
            .map(ResponseEntity::ok);
}


    // 🔹 Récupérer les posts d'un auteur
    @GetMapping("/auteur/{auteurId}")
    public Mono<ResponseEntity<List<Post>>> getPostsByAuteurId(@PathVariable("auteurId") UUID auteurId, @RequestParam UUID memberId) {
        return discussionGroupService.filterPosts(
                        postService.getPostsByAuteurId(auteurId)
                                .flatMap(post -> commentaireService.countDirectCommentairesByPost(post.getPostId())
                                        .map(count -> {
                                            postService.handleDeletedPost(post);
                                            post.setCommentCount(count);
                                            return post;
                                        })),
                        memberId)
                .collectList()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.<List<Post>>status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    // 🔹 Récupérer les posts d'une catégorie
    @GetMapping("/categorie/{categorieId}")
    public Mono<ResponseEntity<List<Post>>> getPostsByCategorieId(@PathVariable("categorieId") UUID categorieId,
            @RequestParam UUID memberId) {
        return discussionGroupService.filterPosts(
                        postService.getPostsByCategorieId(categorieId)
                                .flatMap(post -> commentaireService.countDirectCommentairesByPost(post.getPostId())
                                        .map(count -> {
                                            postService.handleDeletedPost(post);
                                            post.setCommentCount(count);
                                            return post;
                                        })),
                        memberId)
                .collectList()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).<List<Post>>build()));
    }

    // 🔹 Mettre à jour un post
    @PutMapping("/{postId}")
    public Mono<ResponseEntity<Post>> updatePost(@PathVariable("postId") UUID postId, @RequestBody Post post,
            @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.updatePost(postId, post)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).<Post>build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Post>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.<Post>status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    // 🔹 Ajouter un like à un post
   /*  @PostMapping("/{postId}/like")
    public Mono<ResponseEntity<?>> addLike(@PathVariable UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.addLike(postId, memberId)
                                .map(ok -> ok ? ResponseEntity.ok().<Void>build() : ResponseEntity.badRequest().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }*/

@PostMapping("/{postId}/like")
public Mono<ResponseEntity<Post>> toggleLike(
        @PathVariable("postId") UUID postId,
        @RequestParam UUID memberId) {

    return postService.toggleLike(postId, memberId)
        .map(ResponseEntity::ok)
        .defaultIfEmpty(ResponseEntity.badRequest().build());
}


    // 🔹 Supprimer un like d'un post
    @DeleteMapping("/{postId}/like")
    public Mono<ResponseEntity<?>> removeLike(@PathVariable("postId") UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.removeLike(postId, memberId)
                                .map(ok -> ok ? ResponseEntity.ok().<Void>build() : ResponseEntity.badRequest().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    // 🔹 Ajouter un dislike à un post
    /*@PostMapping("/{postId}/dislike")
    public Mono<ResponseEntity<?>> addDislike(@PathVariable UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.addDislike(postId, memberId)
                                .map(ok -> ok ? ResponseEntity.ok().<Void>build() : ResponseEntity.badRequest().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }*/

             @PostMapping("/{postId}/dislike")
public Mono<ResponseEntity<ReactionResponse>> dislike(
        @PathVariable("postId") UUID postId,
        @RequestParam UUID memberId
) {
    return postService.toggleDislike(postId, memberId)
            .map(ResponseEntity::ok);
}


    // 🔹 Supprimer un dislike d'un post
    @DeleteMapping("/{postId}/dislike")
    public Mono<ResponseEntity<?>> removeDislike(@PathVariable("postId") UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.removeDislike(postId, memberId)
                                .map(ok -> ok ? ResponseEntity.ok().<Void>build() : ResponseEntity.badRequest().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    // 🔹 Supprimer un post (marquage de suppression)
    @DeleteMapping("/{postId}")
    public Mono<ResponseEntity<?>> deletePost(@PathVariable("postId") UUID postId, @RequestParam UUID memberId) {
        return discussionGroupService.isUserInPostCommunity(postId, memberId)
                .flatMap(allowed -> {
                    if (allowed) {
                        return postService.deletePost(postId)
                                .map(deleted -> deleted ? ResponseEntity.noContent().<Void>build()
                                        : ResponseEntity.notFound().build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build());
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }
}
