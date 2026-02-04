package com.example.user_interactive_service.models;

import com.example.user_interactive_service.enums.EntityType;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Représente un commentaire dans le système. Contient le contenu, l'auteur, et des informations temporelles relatives à sa création et mise à jour.")
@Table("comments")
public class Comment {

    @Id
    @Schema(description = "Identifiant unique du commentaire", example = "d7d56c5f-dc21-4a5e-9f0b-e8f56d1c9a44")
    private UUID id;

    @Column("content")
    @Schema(description = "Contenu textuel du commentaire", example = "Ceci est un commentaire important.")
    private String content;

    @Column("comment_by_user")
    @Schema(description = "Identifiant de l'utilisateur ayant posté le commentaire", example = "bfed9f84-2c9d-4d5f-9bb0-6d6e15f573a5")
    private UUID commentByUser;

    @CreatedDate
    @Column("created_at")
    @Schema(description = "Date et heure de la création du commentaire", example = "2025-02-08T10:15:30", type = "string", format = "date-time")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    //@UpdateTimestamp
    @Schema(description = "Date et heure de la dernière mise à jour du commentaire", example = "2025-02-08T10:30:45", type = "string", format = "date-time")
    private LocalDateTime updatedAt;

    //@Column(nullable = false)
    @Column("entity_id")
    @Schema(description = "Identifiant de l'entité à laquelle le commentaire est associé", example = "3f9f631a-b09d-42f9-991e-93a558dbfe9f")
    private UUID entityId;

    @Column("entity_type")
    @Schema(description = "type de l'entité auquel le commentaire est associé", example = "APPLICATION")
    private EntityType entityType;

    public Comment() {
    }

    // Constructeur avec tous les paramètres
    public Comment(String content, UUID commentByUser, UUID entityId, EntityType entityType) {
        this.content = content;
        this.commentByUser = commentByUser;
        this.entityId = entityId;
        this.entityType = entityType;
    }

    // Getters et Setters
   public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }
    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }
}
