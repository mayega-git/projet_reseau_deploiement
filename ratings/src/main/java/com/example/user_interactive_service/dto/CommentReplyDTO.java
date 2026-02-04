package com.example.user_interactive_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(description = "DTO représentant une réponse à un commentaire.")
public class CommentReplyDTO {

    @Schema(description = "Contenu de la réponse.", example = "Ceci est une réponse.", required = true)
    @NotNull
    private String content;

    @Schema(description = "Identifiant de l'utilisateur ayant posté la réponse.", example = "dbaedb79-9ac3-4128-8c2f-9250f5cc9f44", required = true)
    @NotNull
    private UUID replyByUserId;

    @Schema(description = "Identifiant du commentaire auquel la réponse est associée.", example = "a3e1bfb0-7351-4ff1-80c5-31ef44e0e71a", required = true)

    private UUID commentId;

    public CommentReplyDTO() {}


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getReplyByUserId() {
        return replyByUserId;
    }

    public void setReplyByUserId(UUID replyByUserId) {
        this.replyByUserId = replyByUserId;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }
}
