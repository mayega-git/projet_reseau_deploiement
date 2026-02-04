package com.letsgo.education_service.models;

import com.letsgo.education_service.enums.Domain;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter


@Table("tag_entity")
public class Tag_entity {

    // Getters et Setters
    @Id
    @Schema(description = "Unique identifier for the tag", example = "603d9b52f3c1c174b1b7b3db")
    private UUID id;

    @Column("name")
    @Schema(description = "Name of the tag", example = "Java")
    private String name;

    @Column("description")
    @Schema(description = "Description of the tag", example = "A programming language used for backend development")
    private String description;

    @CreatedDate
    //@Field("created_at")
    @Column("created_at")

    @Schema(description = "Date when the tag was created", example = "2025-01-31T14:30:00Z")
    private LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    //@Field("updated_at")
    @Column("updated_at")
    @Schema(description = "Date when the tag was last updated", example = "2025-02-01T09:45:00Z")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column("domain")
    @Schema(description = "Domain of the category", example = "SCIENCE")
    private Domain domain;

}
