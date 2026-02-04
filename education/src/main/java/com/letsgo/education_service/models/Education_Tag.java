package com.letsgo.education_service.models;


import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Table("education_tags")
public class Education_Tag {
    @Id
    private UUID id;

    private UUID idBlog;

    private UUID idTag;
    
}
