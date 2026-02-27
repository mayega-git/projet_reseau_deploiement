package com.letsgo.education_service.dto.abonnementDTO;

import com.letsgo.education_service.enums.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AbonnementCreateDTO {

    @NotNull(message = "Content ID is mandatory")
    @Schema(description = "Content ID to which the user is subscribed", example = "uuid")
    private UUID contentId;

    @NotNull(message = "Author ID is mandatory")
    @Schema(description = "Author ID of the content", example = "uuid")
    private UUID authorId;

    @NotNull(message = "Content Type is mandatory")
    @Schema(description = "Type of the content (BLOG, PODCAST, COURSE)", example = "BLOG")
    private ContentType contentType;
}
