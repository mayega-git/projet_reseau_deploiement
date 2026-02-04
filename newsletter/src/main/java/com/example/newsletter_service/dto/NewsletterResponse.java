package com.example.newsletter_service.dto;

import com.example.newsletter_service.enums.StatutNewsletter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterResponse {
    private UUID id;
    private String titre;
    private String contenu;
    private StatutNewsletter statut;
    private UUID redacteurId;
    private String redacteurNom;
    private List<CategorieResponse> categories;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
}
