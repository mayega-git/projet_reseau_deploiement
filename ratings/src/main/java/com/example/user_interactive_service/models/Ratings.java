package com.example.user_interactive_service.models;

import com.example.user_interactive_service.enums.EntityType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;


@Table("ratings")
@Schema(description = "Classe représentant les évaluations des entités.")
public class Ratings {

    @Id
    @Schema(description = "L'ID unique de l'évaluation", example = "123e4567-e89b-12d3-a456-426614174000")
    // Laisser null pour que Spring R2DBC fasse un insert (la colonne a un default DB)
    private UUID id;

    @Column("entity_type")
    private EntityType entityType;

    @Column("user_id")
    @Schema(description = "L'ID de l'utilisateur ayant réalisé l'évaluation", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @Column("like_count")
    @Schema(description = "Le nombre de likes pour cette entité", example = "15")
    private int likeCount;

    @Column("dislike_count")
    @Schema(description = "Le nombre de dislikes pour cette entité", example = "2")
    private int dislikeCount;

    @Column("score")
    @Schema(description = "Le score attribué à l'entité par l'utilisateur", example = "4")
    private int score;

    @Column("entity_id")
    @Schema(description = "L'ID de l'entité évaluée", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID entityId;

    @Column("feedback")
    @Schema(description = "Le feedback de l'utilisateur sur l'entité", example = "Très bonne application !")
    private String feedback;

    @Column("evaluation_date")
    @Schema(description = "La date et l'heure de l'évaluation", example = "2025-02-10T14:30:00")
    private LocalDateTime evaluationDate;

    // Getters et Setters
    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public EntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityType entityType) {
        this.entityType = entityType;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getEvaluationDate() {
        return evaluationDate;
    }

    public void setEvaluationDate(LocalDateTime evaluationDate) {
        this.evaluationDate = evaluationDate;
    }
}
