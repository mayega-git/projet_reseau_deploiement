package com.example.user_interactive_service.dto;

import com.example.user_interactive_service.enums.EntityType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "DTO pour la création ou mise à jour des évaluations d'une entité.")
public class RatingsDTO {

    @Schema(description = "Identifiant de l'utilisateur ayant effectué l'évaluation", example = "bfed9f84-2c9d-4d5f-9bb0-6d6e15f573a5")
    private UUID userId;

    @Schema(description = "Type de l'entité évaluée (par exemple, APPLICATION, ARTICLE)", example = "APPLICATION")
    private EntityType entityType;

    @Schema(description = "Identifiant de l'entité évaluée", example = "3f9f631a-b09d-42f9-991e-93a558dbfe9f")
    private UUID entityId;

    @Schema(description = "Nombre de likes attribués à l'entité", example = "12")
    private int likeCount;

    @Schema(description = "Nombre de dislikes attribués à l'entité", example = "3")
    private int dislikeCount;

    @Schema(description = "Score attribué à l'entité, par exemple 1-5 étoiles", example = "4")
    private int score;

    // Getters et Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public int getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(int dislikeCount) {
        this.dislikeCount = dislikeCount;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
