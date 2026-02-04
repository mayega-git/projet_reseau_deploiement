package com.example.newsletter_service.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCategoriesRequest {
    @NotEmpty(message = "La liste de catégories ne peut pas être vide")
    private List<UUID> categorieIds;
}
