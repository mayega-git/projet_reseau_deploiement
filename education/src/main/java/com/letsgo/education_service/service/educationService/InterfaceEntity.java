package com.letsgo.education_service.service.educationService;

import java.util.UUID;

import com.letsgo.education_service.enums.ContentStatus;

import java.time.LocalDateTime;

public interface InterfaceEntity {

    UUID getId();

    void setAudioDuration(String audioDuration);

    void setId_ressource(UUID idRessource);

    UUID getId_ressource();

    void setStatus(ContentStatus status);

    ContentStatus getStatus();

    void setPublishedAt(LocalDateTime publishedAt);

    void setUpdatedAt(LocalDateTime updatedAt);

}
