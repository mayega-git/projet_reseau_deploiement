package com.letsgo.education_service.dto.abonnementDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.letsgo.education_service.enums.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AbonnementResponseDTO {

    @Schema(description = "Subscription ID", example = "uuid")
    private UUID id;

    @Schema(description = "Subscriber User ID", example = "uuid")
    private UUID userId;

    @Schema(description = "Author ID of the content", example = "uuid")
    private UUID authorId;

    @Schema(description = "Content ID to which the user is subscribed", example = "uuid")
    private UUID contentId;

    @Schema(description = "Type of the content", example = "BLOG")
    private ContentType contentType;

    @Schema(description = "Subscription creation date", example = "2025-01-31T14:30:00")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime createdAt;
}
