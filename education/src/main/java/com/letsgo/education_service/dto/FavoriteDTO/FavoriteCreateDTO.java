package com.letsgo.education_service.dto.FavoriteDTO;

import com.letsgo.education_service.enums.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO pour la création d'un favori")
public class FavoriteCreateDTO {

    @NotNull
    @Schema(description = "ID de l'utilisateur", example = "550e8400-e29b-41d4-a716-446655440000")
    private String userId;

    @NotNull
    @Schema(description = "ID de l'entité mise en favori", example = "550e8400-e29b-41d4-a716-446655440001")
    private String entityId;

    @NotNull
    @Schema(description = "Type de l'entité mise en favori (ex: BLOG, PODCAST)", example = "BLOG")
    private ContentType contentType;
}
