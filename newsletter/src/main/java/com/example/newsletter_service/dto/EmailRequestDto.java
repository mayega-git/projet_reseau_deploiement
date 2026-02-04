package com.example.newsletter_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailRequestDto(
    @NotBlank(message = "L'email du destinataire est obligatoire")
    @Email(message = "L'email du destinataire doit être valide")
    String emailDestinataire,
    
       @NotBlank(message = "Le sujet est obligatoire")
    String sujet,
    
    
    @NotBlank(message = "Le contenu de l'email est obligatoire")
    String contenuEmail
) {
}
