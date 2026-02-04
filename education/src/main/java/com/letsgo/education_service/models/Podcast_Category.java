package com.letsgo.education_service.models;

import java.util.UUID;

import org.springframework.data.relational.core.mapping.Table;

import lombok.Data;

@Data
@Table("podcast_categories")
public class Podcast_Category {

    private String idPodcast;

    private String idCategory;
    
}
