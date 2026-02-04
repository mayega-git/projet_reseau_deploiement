package com.letsgo.education_service.dto.PodcastDTO;

import com.letsgo.education_service.enums.Domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class PodcastCreateDTO {



    @NotBlank(message = "Le titre ne peut pas être vide")
    @Schema(description = "Titre du podcast", example = "Les bases de Spring Boot")
    private String title;

    @NotNull(message = "L'identifiant de l'auteur est requis")
    @Schema(description = "ID de l'auteur", example = "3b4f0154-7273-48b6-9529-1eaa24460c3d")
    private UUID authorId;


    @NotNull(message = "S'il appartient à une organisation")
    @Schema(description = "ID de l'organisation", example = "3b4f0154-7273-48b6-9529-1eaa24460c3d")
    private UUID organisationId;

    @NotBlank(message = "La description ne peut pas être vide")
    private String description;

    @NotEmpty(message = "Les tags ne peuvent pas être nuls")
    @Schema(description = "Liste des tags associés", example = "[\"Spring Boot\", \"Java\"]")
    private List<String> tags;

    @NotBlank(message = "Transcription de l'audio")
    @Schema(description = "Transcription de l\'audio", example = "Transcription de l\'audio")
    private String transcript;

    
    @NotBlank(message = "Le nom du domaine")
    @Schema(description = "Le nom du domaine", example = "LITTERATURE")
    private String domain;

   
    @Schema(description = "categorie", example = "[\"Roman\",\"Essai\"]")
    private List<String> categories;


}
