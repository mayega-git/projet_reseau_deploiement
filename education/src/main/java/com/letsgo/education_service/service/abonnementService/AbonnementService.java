package com.letsgo.education_service.service.abonnementService;

import com.letsgo.education_service.dto.abonnementDTO.AbonnementCreateDTO;
import com.letsgo.education_service.dto.abonnementDTO.AbonnementResponseDTO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface AbonnementService {

    Mono<AbonnementResponseDTO> subscribe(UUID userId, AbonnementCreateDTO createDTO);

    Mono<Void> unsubscribe(UUID userId, UUID contentId);

    Flux<AbonnementResponseDTO> getUserSubscriptions(UUID userId);

    Mono<Long> getSubscriptionCountForContent(UUID contentId);

    Mono<Boolean> isSubscribed(UUID userId, UUID contentId);
}
