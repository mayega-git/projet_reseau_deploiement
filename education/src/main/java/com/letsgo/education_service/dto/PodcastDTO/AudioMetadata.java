package com.letsgo.education_service.dto.PodcastDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AudioMetadata {
    
    private String duration;
    private String format;
    private int bitrate;
    private int sampleRate;
    private long fileSize;
    
}
