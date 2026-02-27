package com.letsgo.education_service.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.letsgo.education_service.enums.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table("abonnement")
public class Abonnement_entity {

    @Id
    @Schema(description = "Unique identifier of the subscription", example = "e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f")
    private UUID id;

    @Column("user_id")
    @Schema(description = "Subscriber User ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    @Column("author_id")
    @Schema(description = "Author (Content Creator) User ID", example = "e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f")
    private UUID authorId;

    @Column("content_id")
    @Schema(description = "Content ID to which the user is subscribed", example = "uuid-of-the-blog-podcast-or-course")
    private UUID contentId;

    @Column("content_type")
    @Schema(description = "Type of the content", example = "BLOG")
    private ContentType contentType;

    @Column("created_at")
    @Schema(description = "Subscription creation date", example = "2025-01-31T14:30:00")
    @CreatedDate
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime createdAt;
}
