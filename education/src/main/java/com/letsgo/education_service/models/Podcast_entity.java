package com.letsgo.education_service.models;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

//import org.springframework.data.cassandra.core.mapping.Column;
//import org.springframework.data.cassandra.core.mapping.Table;

import com.letsgo.education_service.service.educationService.InterfaceEntity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Table("podcast_entity")
public class Podcast_entity extends Education_entity implements InterfaceEntity {

    @Column("audio_url")
    @Schema(description = "URL of podcast audio file", example = "https://api.media-storage.com/files/podcast123.mp3")
    private String audioUrl;

    @Column("audio_length")
    @Schema(description = "Podcast duration in format HH:MM:SS", example = "01:25:30")
    private String audioDuration;

    @Column("transcript")
    @Schema(description = "Podcast transcript", example = "Bienvenue dans ce nouvel épisode...")
    private String transcript;

}
