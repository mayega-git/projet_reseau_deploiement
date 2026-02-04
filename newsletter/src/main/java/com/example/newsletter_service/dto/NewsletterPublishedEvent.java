package com.example.newsletter_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Événement publié dans Kafka lors de la publication d'une newsletter
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterPublishedEvent {
    private UUID newsletterId;
    private String titre;
    private String contenu;
    private UUID redacteurId;
    private String redacteurNom;
    private List<UUID> categorieIds;
    private LocalDateTime publishedAt;
}