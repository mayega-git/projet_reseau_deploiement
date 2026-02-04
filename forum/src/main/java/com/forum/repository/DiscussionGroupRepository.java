package com.forum.repository;

import com.forum.model.DiscussionGroup;
import com.forum.model.*;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

@Repository
public interface DiscussionGroupRepository extends ReactiveCrudRepository<DiscussionGroup, UUID> {



    Mono<DiscussionGroup> findByGroupId(UUID groupId);



    Mono<Boolean> existsByGroupId(UUID groupId);

    Flux<DiscussionGroup> findByType(GroupType type);

    Flux<DiscussionGroup> findByCreatorName(String creatorName);

    Flux<DiscussionGroup> findByMembersContaining(UUID memberId);

    Flux<DiscussionGroup> findByStatus(ForumStatus status);

}
