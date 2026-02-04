package com.example.newsletter_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;


import java.util.Set;

/**
 * Requête de création de newsletter
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterCreateRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    
    @NotBlank(message = "Le contenu est obligatoire")
    private String contenu; // HTML
    
    @NotEmpty(message = "Vous devez choisir au moins une catégorie")
    private List<UUID> categorieIds;

   
}
