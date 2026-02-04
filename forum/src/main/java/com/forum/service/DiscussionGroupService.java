package com.forum.service;

import com.forum.model.Categorie;
import com.forum.model.DiscussionGroup;
import com.forum.model.GroupType;
import com.forum.model.*;
import com.forum.repository.DiscussionGroupRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Service
public class DiscussionGroupService {

    private UUID keyId;


    private final DiscussionGroupRepository discussionGroupRepository;
    private final ForumCategorieService categorieService;
    private final PostService postService;

    public DiscussionGroupService(DiscussionGroupRepository discussionGroupRepository,
            ForumCategorieService categorieService, PostService postService) {
        this.discussionGroupRepository = discussionGroupRepository;
        this.categorieService = categorieService;
        this.postService = postService;
    }

    // 🔹 Vérifier si un utilisateur appartient à la communauté d'un post
    public Mono<Boolean> isUserInPostCommunity(UUID postId, UUID memberId) {
        return postService.getPostById(postId)
                .flatMap(post -> this.getDiscussionGroupById(post.getGroupId())
                        .map(group -> {
                            if (group.getType() == GroupType.COMMUNITY) {
                                return group.getMembers() != null && group.getMembers().contains(memberId);
                            }
                            return true;
                        }))
                .defaultIfEmpty(false);
    }

    // 🔹 Vérifier si un utilisateur appartient à la communauté d'un post
    public Mono<Boolean> isUserInCommunity(UUID groupId, UUID memberId) {
        return this.getDiscussionGroupById(groupId)
                .map(group -> {
                    if (group.getType() == GroupType.COMMUNITY) {
                        return group.getMembers() != null && group.getMembers().contains(memberId);
                    }
                    return true;
                })
                .defaultIfEmpty(false);
    }

    //Pour ne renvoyer que les posts des communautés auxquelles l'utilisateur appartient
    public Flux<Post> filterPosts(Flux<Post> posts, UUID memberId) {
        return posts.filterWhen(post ->
                this.getDiscussionGroupById(post.getGroupId())
                        .map(group -> {
                            if (group.getType() == GroupType.COMMUNITY) {
                                return group.getMembers() != null && group.getMembers().contains(memberId);
                            }
                            return true;
                        })
                        .defaultIfEmpty(false)
        );
    }

    // Créer un nouveau groupe de discussion
    /*public Mono<DiscussionGroup> createDiscussionGroup(DiscussionGroup group) {
        System.out.println("groupKeyId: " + group.getKeyId());
        if (group.getType() == GroupType.FORUM && group.getMembers() != null && !group.getMembers().isEmpty()) {
            group.setMembers(null);
        }
        group.setGroupId(UUID.randomUUID());
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(null);
        group.markNew();
        return discussionGroupRepository.save(group);
    }*/

    /*public Mono<DiscussionGroup> createDiscussionGroup(DiscussionGroup group) {

        // 🔐 Génération automatique du keyId (API Key du groupe)
        group.setKeyId(UUID.randomUUID());

        // 🧠 Règle métier : un FORUM n'a pas de membres définis à la création
        if (group.getType() == GroupType.FORUM &&
                group.getMembers() != null &&
                !group.getMembers().isEmpty()) {
            group.setMembers(null);
        }

        // 🆔 Identifiant interne du groupe
        group.setGroupId(UUID.randomUUID());

        // ⏱️ Métadonnées temporelles
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(null);

        // 🆕 Marque l'entité comme nouvelle (si tu utilises Spring Data Reactive)
        group.markNew();

        // 💾 Sauvegarde en base
        return discussionGroupRepository.save(group);
    }*/

    public Mono<DiscussionGroup> validateForum(UUID groupId) {

        return discussionGroupRepository.findById(groupId)
                .switchIfEmpty(Mono.error(new RuntimeException("Forum not found")))
                .flatMap(group -> {
                    group.setStatus(ForumStatus.VALIDATED);
                    group.setUpdatedAt(Instant.now());
                    return discussionGroupRepository.save(group);
                });
    }
     public Mono<DiscussionGroup> rejectForum(UUID groupId) {

        return discussionGroupRepository.findById(groupId)
                .switchIfEmpty(Mono.error(new RuntimeException("Forum not found")))
                .flatMap(group -> {
                    group.setStatus(ForumStatus.REJECTED);
                    group.setUpdatedAt(Instant.now());
                    return discussionGroupRepository.save(group);
                });
    }


    public Flux<DiscussionGroup> getPublicForums() {
        return discussionGroupRepository.findByStatus(ForumStatus.VALIDATED);
    }





    public Mono<DiscussionGroup> createDiscussionGroup(DiscussionGroup group) {



                    if (group.getType() == GroupType.FORUM) {
                        group.setMembers(null);
                    }

                    group.setGroupId(UUID.randomUUID());
                    group.setStatus(ForumStatus.PENDING);
                    group.setCreatedAt(Instant.now());
                    group.setUpdatedAt(null);
                    group.markNew();

                    return discussionGroupRepository.save(group);

    }




    // Récupérer un groupe de discussion par son ID
    public Mono<DiscussionGroup> getDiscussionGroupById(UUID groupId) {
        return discussionGroupRepository.findByGroupId(groupId);
    }



    // Récupérer tous les groupes
    public Flux<DiscussionGroup> getDiscussionGroups() {
        return discussionGroupRepository.findAll();
    }

    // Mettre à jour un groupe de discussion
    public Mono<DiscussionGroup> updateDiscussionGroup(UUID groupId, DiscussionGroup group) {
        return discussionGroupRepository.findByGroupId(groupId)
                .flatMap(existingGroup -> {

                    if (group.getCreatorName() != null) {
                        existingGroup.setCreatorName(group.getCreatorName());
                    }
                    if (group.getName() != null) {
                        existingGroup.setName(group.getName());
                    }
                    if (group.getType() != null) {
                        existingGroup.setType(group.getType());
                    }
                    if (group.getDescription() != null) {
                        existingGroup.setDescription(group.getDescription());
                    }
                    if (group.getMembers() != null) {
                        existingGroup.setMembers(group.getMembers());
                    }

                    existingGroup.setUpdatedAt(Instant.now());
                    existingGroup.setGroupId(groupId);
                    return discussionGroupRepository.save(existingGroup);
                });
    }

    // Supprimer un groupe de discussion (soft delete en utilisant `deletedAt`)
    public Mono<Boolean> deleteDiscussionGroup(UUID groupId) {
        return discussionGroupRepository.findByGroupId(groupId)
                .flatMap(group -> {
                    group.setDeletedAt(Instant.now());
                    Mono<Void> deleteCategories = categorieService.getCategoriesByGroupeId(groupId)
                            .flatMap(categorie -> categorieService.deleteCategorie(categorie.getCategorieId()).then())
                            .then();

                    Mono<Void> deletePosts = postService.getPostsByGroupeId(groupId)
                            .flatMap(post -> postService.deletePost(post.getPostId()).then())
                            .then();

                    return discussionGroupRepository.save(group)
                            .then(deleteCategories)
                            .then(deletePosts)
                            .thenReturn(true);
                })
                .defaultIfEmpty(false);
    }
    // Ajouter un membre à une communauté
    public Mono<Boolean> addMemberToCommunity(UUID groupId, UUID memberId) {
        return discussionGroupRepository.findByGroupId(groupId)
                .flatMap(group -> {
                    if (group.getType() == GroupType.COMMUNITY) {
                        if (group.getMembers() == null) {
                            group.setMembers(new java.util.ArrayList<>());
                        }
                        group.getMembers().add(memberId);
                        group.setUpdatedAt(Instant.now());
                        return discussionGroupRepository.save(group).thenReturn(true);
                    }
                    return Mono.just(false);
                })
                .defaultIfEmpty(false);
    }
}
