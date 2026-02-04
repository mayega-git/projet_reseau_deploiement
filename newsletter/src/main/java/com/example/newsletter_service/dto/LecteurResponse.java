package com.example.newsletter_service.dto;
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
public class LecteurResponse {
    private UUID id;
    private UUID userId;
    private String email;
    private String nom;
    private String prenom;
    private List<CategorieResponse> categories;
    private LocalDateTime createdAt;
}