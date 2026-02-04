package com.forum.controller;

import com.forum.model.*;
import com.forum.service.DiscussionGroupService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/education-service/forum")
public class DiscussionGroupController {

    @Autowired
    private DiscussionGroupService discussionGroupService;

    // Créer un groupe de discussion
    @PostMapping("/groups")
    public Mono<ResponseEntity<Object>> createDiscussionGroup(@RequestBody DiscussionGroup group) {
        if (group.getCreatorId() == null) {
            return Mono.just(ResponseEntity.badRequest().body("The creator Id must not be null"));
        } else if (group.getName() == null || group.getName().isBlank()) {
            return Mono.just(ResponseEntity.badRequest().body("The group name is required and must not be empty"));
        } else if (group.getType() == null) {
            return Mono.just(ResponseEntity.badRequest().body("The group type is required"));
        } else if (group.getType().toString().equals("COMMUNITY") && (group.getMembers() == null || group.getMembers().isEmpty())) {
            return Mono.just(ResponseEntity.badRequest().body("The group type is COMMUNITY, so members are required"));
        }
        return discussionGroupService.createDiscussionGroup(group)
                .map(created -> ResponseEntity.ok((Object) created))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(400).body(e.getMessage())));
    }

    /*@PostMapping("/groups")
    public Mono<ResponseEntity<Object>> createDiscussionGroup(
            @RequestBody DiscussionGroup group
    ) {

        if (group.getCreatorId() == null) {
            return Mono.just(ResponseEntity.badRequest().body("The creator Id must not be null"));
        }

        if (group.getName() == null || group.getName().isBlank()) {
            return Mono.just(ResponseEntity.badRequest().body("The group name is required and must not be empty"));
        }

        if (group.getType() == null) {
            return Mono.just(ResponseEntity.badRequest().body("The group type is required"));
        }

        if (group.getType() == GroupType.COMMUNITY &&
                (group.getMembers() == null || group.getMembers().isEmpty())) {
            return Mono.just(ResponseEntity.badRequest().body(
                    "The group type is COMMUNITY, so members are required"
            ));
        }

        return discussionGroupService.createDiscussionGroup(group)
                .map(created -> ResponseEntity.ok((Object) created))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest().body(e.getMessage()))
                );
    }*/

    /*@PostMapping("/groups")
    public Mono<ResponseEntity<Object>> createDiscussionGroup(
            @RequestBody DiscussionGroup group) {

        if (group.getKeyId() == null) {
            return Mono.just(ResponseEntity.badRequest()
                    .body("API key is required"));
        }

        return discussionGroupService.createDiscussionGroup(group)
                .map(ResponseEntity::ok)
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.badRequest().body(e.getMessage())));
    }*/



    // Récupérer un groupe de discussion par son ID
    @GetMapping("/groups/{groupId}")
    public Mono<ResponseEntity<DiscussionGroup>> getDiscussionGroupById(@PathVariable("groupId") UUID groupId) {
        return discussionGroupService.getDiscussionGroupById(groupId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).build()));
    }


    @PutMapping("/groups/{id}/validate")
    public Mono<ResponseEntity<?>> validateForum(@PathVariable("id") UUID id) {

        return discussionGroupService.validateForum(id)
                .map(updated -> ResponseEntity.ok(updated));
    }
     @PutMapping("/groups/{id}/reject")
    public Mono<ResponseEntity<?>> rejectForum(@PathVariable("id") UUID id) {

        return discussionGroupService.rejectForum(id)
                .map(updated -> ResponseEntity.ok(updated));
    }



    // Récupérer tous les groupes de discussion
    @GetMapping("/groups/all")
    public ResponseEntity<Flux<DiscussionGroup>> getAllDiscussionGroups() {
        try {
            Flux<DiscussionGroup> groups = discussionGroupService.getDiscussionGroups();
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    // Mettre à jour un groupe de discussion
    @PutMapping("/groups/{groupId}")
    public Mono<ResponseEntity<DiscussionGroup>> updateDiscussionGroup(
            @PathVariable("groupId") UUID groupId,
            @RequestBody DiscussionGroup group) {
        return discussionGroupService.updateDiscussionGroup(groupId, group)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).build()));
    }

    // Supprimer un groupe de discussion
    @DeleteMapping("/groups/{groupId}")
    public Mono<ResponseEntity<?>> deleteDiscussionGroup(@PathVariable("groupId") UUID groupId) {
        return discussionGroupService.deleteDiscussionGroup(groupId)
                .map(deleted -> deleted ? ResponseEntity.noContent().<Void>build() : ResponseEntity.notFound().build())
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }
    // Ajouter un membre à une communauté
    @PostMapping("/groups/{groupId}/members")
    public Mono<ResponseEntity<?>> addMemberToCommunity(@PathVariable("groupId") UUID groupId, @RequestParam UUID memberId) {
        return discussionGroupService.addMemberToCommunity(groupId, memberId)
                .map(added -> added ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Member could not be added"))
                .defaultIfEmpty(ResponseEntity.badRequest().body("Member could not be added"))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body(e.getMessage())));
    }
}
