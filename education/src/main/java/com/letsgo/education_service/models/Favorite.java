package com.letsgo.education_service.models;

import com.letsgo.education_service.enums.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
//@Document(collection = "favorites")
@Table("favorites")
@Schema(description = "Représente un élément favori enregistré par un utilisateur.")
public class Favorite {

    @Id
    @Schema(description = "Identifiant unique du favori", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Column("user_id")
    @Schema(description = "Identifiant de l'utilisateur ayant ajouté l'élément en favori", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID userId;

    @Column("entity_id")
    @Schema(description = "Identifiant de l'élément favorisé", example = "9b2a1c2e-2f1e-3c4d-8d5e-123456789abc")
    private UUID entityId;

    @Column("entity_type")
    @Schema(description = "Type de l'élément favorisé (ex: BLOG, PODCAST)", example = "BLOG")
    private ContentType contentType;



    /*@Column("podcast_id")
    @Schema(description = "Type de l'élément favorisé PODCAST", example = "BLOG")
    private String podcastId;*/


    @Column("created_at")
    @CreatedDate
    @Schema(description = "Date et heure de l'ajout aux favoris", example = "2025-02-15T14:30:00")
    private LocalDateTime createdAt;


}
