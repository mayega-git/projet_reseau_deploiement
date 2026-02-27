package com.letsgo.education_service.service.abonnementService;

import com.letsgo.education_service.dto.abonnementDTO.AbonnementCreateDTO;
import com.letsgo.education_service.dto.abonnementDTO.AbonnementResponseDTO;
import com.letsgo.education_service.models.Abonnement_entity;
import com.letsgo.education_service.repository.AbonnementRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.slf4j.Logger;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AbonnementServiceImpl implements AbonnementService {

    private final AbonnementRepository abonnementRepository;
    private static final Logger log = LoggerFactory.getLogger(AbonnementServiceImpl.class);

    @Override
    public Mono<AbonnementResponseDTO> subscribe(UUID userId, AbonnementCreateDTO createDTO) {
        log.info("User {} subscribing to content {}", userId, createDTO.getContentId());

        return abonnementRepository.findByUserIdAndContentId(userId, createDTO.getContentId())
                .flatMap(existing -> Mono.error(new RuntimeException("User is already subscribed to this content")))
                .switchIfEmpty(Mono.defer(() -> {
                    Abonnement_entity entity = Abonnement_entity.builder()
                            .userId(userId)
                            .authorId(createDTO.getAuthorId())
                            .contentId(createDTO.getContentId())
                            .contentType(createDTO.getContentType())
                            .createdAt(LocalDateTime.now())
                            .build();
                    return abonnementRepository.save(entity);
                }))
                .cast(Abonnement_entity.class)
                .map(this::mapToResponseDTO);
    }

    @Override
    public Mono<Void> unsubscribe(UUID userId, UUID contentId) {
        log.info("User {} unsubscribing from content {}", userId, contentId);
        return abonnementRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    @Override
    public Flux<AbonnementResponseDTO> getUserSubscriptions(UUID userId) {
        log.info("Fetching subscriptions for user {}", userId);
        return abonnementRepository.findAllByUserId(userId)
                .map(this::mapToResponseDTO);
    }

    @Override
    public Mono<Long> getSubscriptionCountForContent(UUID contentId) {
        log.info("Fetching subscription count for content {}", contentId);
        return abonnementRepository.countByContentId(contentId);
    }

    @Override
    public Mono<Boolean> isSubscribed(UUID userId, UUID contentId) {
        return abonnementRepository.findByUserIdAndContentId(userId, contentId)
                .hasElement();
    }

    private AbonnementResponseDTO mapToResponseDTO(Abonnement_entity entity) {
        return AbonnementResponseDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .authorId(entity.getAuthorId())
                .contentId(entity.getContentId())
                .contentType(entity.getContentType())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
