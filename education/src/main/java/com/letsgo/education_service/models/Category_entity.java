package com.letsgo.education_service.models;

import com.letsgo.education_service.enums.Domain;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;


import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;

@AllArgsConstructor
@Setter
@Getter
@Table("category_entity")
public class Category_entity {

    @Id
    
    @Schema(description = "Unique identifier for the category", example = "603d9b52f3c1c174b1b7b3db")
    private UUID id;

    @Column("name")
    @Schema(description = "Name of the category", example = "Technology")
    private String name;

    @Column("description")
    @Schema(description = "Description of the category", example = "This category includes all topics related to technology.")
    private String description;

    @Column("domain")
    @Schema(description = "Domain associated with the category", example = "TECHNOLOGY")
    private Domain domain;

    @CreatedDate
    @LastModifiedDate
    //@Field("created_at")
    @Column("created_at")
    @Schema(description = "Date when the category was created", example = "2025-01-31T14:30:00Z")
    private Instant createdAt;

    @LastModifiedDate
    //@Field("updated_at")
    @Column("updated_at")
    @Schema(description = "Date when the category was last updated", example = "2025-02-01T09:45:00Z")
    private Instant updatedAt;

    public Category_entity() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Category_entity(String name, String description, Domain domain) {
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Category_entity(String name, String description) {
        
    }
}
