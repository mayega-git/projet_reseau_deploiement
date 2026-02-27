package com.letsgo.education_service.dto.BlogDTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

import com.letsgo.education_service.dto.EducationCreateDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class BlogCreateDTO implements EducationCreateDTO {

    @NotBlank
    @Schema(description = "Titre du blog", example = "Les bases de Spring Boot")
    private String title;

    @NotBlank
    @Schema(description = "Description du blog", example = "Introduction à Spring Boot et ses fonctionnalités principales.")
    private String description;

    @NotNull(message = "L'identifiant de l'auteur est requis")
    @Schema(description = "ID de l'auteur du blog", example = "123456")
    private UUID authorId;

    @NotNull(message = "S'il appartient à une organisation")
    @Schema(description = "ID de l'organisation", example = "123456")
    private UUID organisationId;

    @NotBlank
    @Schema(description = "Domaine du blog", example = "Litterature")
    private String domain;

    @NotBlank
    @Schema(description = "Contenu du blog", example = "Spring Boot facilite le développement des applications Spring...")
    private String content;

    @Schema(description = "Liste des tags associés", example = "[\"Spring Boot\", \"Java\"]")
    private List<String> tags;

    /*
     * @Schema(description = "URL de l'audio du blog (optionnel)", example =
     * "https://example.com/audio.mp3")
     * private String audioUrl;
     */

    @NotNull
    @Schema(description = "Temps de lecture estimé en minutes", example = "10")
    private Integer readingTime;

    @NotEmpty
    @Schema(description = "categorie", example = "[\"Roman\",\"Essai\"]")
    private List<String> categories;

}
