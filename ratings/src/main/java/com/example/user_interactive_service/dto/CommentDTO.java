package com.example.user_interactive_service.dto;

import com.example.user_interactive_service.enums.EntityType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentDTO {

    @NotBlank
    @Schema(description = "Le contenu du commentaire", example = "Ceci est un commentaire.")
    private String content;

    @NotNull
    @Schema(description = "L'ID de l'utilisateur ayant rédigé le commentaire", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID commentByUser;

    @NotNull
    @Schema(description = "L'ID de l'entité à laquelle le commentaire est lié", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID entityId;

    @NotNull
    @Schema(description = "Le type de l'entité auquel le commentaire est lié", example = "APPLICATION")
    private EntityType entityType;

    public CommentDTO() {
    }

    public CommentDTO(String content, UUID commentByUser, UUID entityId, EntityType entityType) {
        this.content = content;
        this.commentByUser = commentByUser;
        this.entityId = entityId;
        this.entityType = entityType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getCommentByUser() {
        return commentByUser;
    }

    public void setCommentByUser(UUID commentByUser) {
        this.commentByUser = commentByUser;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }
}
