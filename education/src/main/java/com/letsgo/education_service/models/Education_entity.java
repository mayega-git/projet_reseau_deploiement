package com.letsgo.education_service.models;

import com.letsgo.education_service.enums.ContentStatus;
import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.enums.Domain;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.MappedCollection;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter


public abstract class Education_entity {

    @Schema(description = "Unique identifier", example = "e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f")
    @Id
    private UUID id;


    @Column("title")
    @Schema(description = "Content title", example = "Les Mystères de l'Univers")
    private String title;

    @Column("description")
    @Schema(description = "Content description", example = "Une exploration des mystères de l'univers et des astres.")
    private String description;

    


    @Column("author_id")
    @Schema(description = "Author ID", example = "e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f")
    private UUID authorId;

    @Column("organisation_id")
    @Schema(description = "Organisation ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID organisationId;

    @Column("created_at")
    @Schema(description = "Date of creation", example = "2025-01-31T14:30:00")
    @CreatedDate
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column("published_at")
    @Schema(description = "Publish date", example = "2025-01-31T14:30:00")
    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column("updated_at")
    @Schema(description = "Last update date", example = "2025-01-31T14:30:00")
    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column("status")
    @Schema(description = "Content status", example = "PUBLISHED")
    private ContentStatus status;

    @Column("content_type")
    @Schema(description = "Content type", example = "PODCAST")
    private ContentType contentType;

    @Column("domain")
    @Schema(description = "Domain", example = "TAXI, AGRICULTURE")
    private Domain domain;

   /* @Column("id_plateforme")
    @Schema(description = "Plateforme" , example = "123d4567-e89b-12d3-a456-426614174000")
    private UUID plateformeId;*/

    @Column("id_ressource")
    @Schema(description = "Ressource ID" , example = "123d4567-e89b-12d3-a456-426614174000")
    private UUID id_ressource;

    @Column("audio_length")
    @Schema(description = "Audio duration in format HH:MM:SS", example = "00:15:30")
    private String audioDuration;


    
    /*@Transient 
    @Column("tags")
    @Schema(description = "Tags associated with the content", example = "[\"Education\", \"Science\", \"Astronomy\"]")
    @MappedCollection(idColumn = "education_id", keyColumn = "tag_id")
    private List<String> tags;*/

    


}
