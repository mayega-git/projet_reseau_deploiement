package com.letsgo.education_service.models;

import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import com.letsgo.education_service.service.educationService.InterfaceEntity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter

@Table("blog_entity")
public class Blog_entity extends Education_entity implements InterfaceEntity {


    @Column("content")
    @Schema(description = "Full content of the blog post", example = "L'univers est un vaste espace rempli de mystères...")
    private String content;

    @Column("reading_time")
    @Schema(description = "Estimated reading time in minutes", example = "5")
    private int readingTime;

    /*@Column("audio_url")
    @Schema(description = "URL of associated audio file", example = "https://api.media-storage.com/files/audio123.mp3")
    private String audioUrl;*/
    
    
    

}
