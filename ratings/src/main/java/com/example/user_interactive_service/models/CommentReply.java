package com.example.user_interactive_service.models;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("comment_replies")
@Schema(description = "Classe représentant une réponse à un commentaire.")
@Getter
@Setter
public class CommentReply implements Persistable<UUID> {

    @Setter
    @Id
    
    @NotNull
    private UUID id;

    @Getter
    @NotNull
    @Column("content")
    @Schema(description = "Contenu de la réponse.", example = "Ceci est une réponse.", required = true)
    private String content;

    @NotNull
    @Column("reply_by_user_id")
    @Schema(description = "Identifiant de l'utilisateur ayant posté la réponse.", example = "dbaedb79-9ac3-4128-8c2f-9250f5cc9f44", required = true)
    private UUID replyByUserId;

    @Column("created_at")
    //@Temporal(TemporalType.TIMESTAMP)
    @Schema(description = "Date de création de la réponse.", example = "2025-02-08T12:34:56")
    private OffsetDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    //@Temporal(TemporalType.TIMESTAMP)
    @Schema(description = "Date de mise à jour de la réponse.", example = "2025-02-08T12:34:56")
    private OffsetDateTime updatedAt;

    // ID du commentaire auquel la réponse appartient
    @Column("comment_id")
    @Schema(description = "Identifiant du commentaire auquel cette réponse est associée.", example = "a3e1bfb0-7351-4ff1-80c5-31ef44e0e71a", required = true)
    private UUID commentId;

    @Transient
    private boolean isNew = false;

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    public void markNew() {
        this.isNew = true;
    }

    //@PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }



}
