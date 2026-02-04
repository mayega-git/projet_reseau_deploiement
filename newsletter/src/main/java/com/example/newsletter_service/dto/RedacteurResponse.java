package com.example.newsletter_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedacteurResponse {
    private UUID id;
    private String email;
    private String nom;
    private String prenom;
    private String password;
    private LocalDateTime createdAt;
}