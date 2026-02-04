package com.letsgo.education_service.dto.EducationDTO;

import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import io.swagger.v3.oas.annotations.media.Schema;

public class EducationEntityCreateDTO {

    @Schema(description = "Title content", example = "Les Mystères de l'Univers")
    private String title;

    @Schema(description = "Description", example = "Une exploration des mystères de l'univers et des astres.")
    private String description;

    @Schema(description = "AuthorId", example = "Jean Dupont")
    private String authorId;

    @Schema(description = "Content type", example = "PODCAST")
    private ContentType contentType;

    @Schema(description = "Domain name", example = "TAXI, AGRICULTURE")
    private Domain domain;

    @Schema(description = "URL of cover image", example = "http://example.com/cover.jpg")
    private String coverImage;


    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getAuthorId() {
        return authorId;
    }


    public ContentType getContentType() {
        return contentType;
    }

    public Domain getDomain() {
        return domain;
    }

    public String getCoverImage() {
        return coverImage;  // Getter pour coverImage
    }


    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;  // Setter pour coverImage
    }
}
