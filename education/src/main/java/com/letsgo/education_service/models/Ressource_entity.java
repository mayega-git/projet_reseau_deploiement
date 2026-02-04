package com.letsgo.education_service.models;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Data;

@Data
@Table("ressource_entity")
public class Ressource_entity {

    @Id
    private UUID id;
    
    private UUID coverId;
    private String coverUri;
    private UUID audioId;
    private String audioUri;
    private String mimeType;
    private String extensionFile;
    private String realName;
    
}
