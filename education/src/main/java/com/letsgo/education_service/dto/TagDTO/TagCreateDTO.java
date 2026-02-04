package com.letsgo.education_service.dto.TagDTO;

import com.letsgo.education_service.enums.Domain;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class TagCreateDTO {


    @Schema(description = "Nom du tag", example = "Java")
    private String name;

    @Schema(description = "Description du tag", example = "Un langage de programmation utilisé pour le développement backend")
    private String description;

    @Schema(description = "Domain", example = "AGRICULTURE")
    private String domain;

}
