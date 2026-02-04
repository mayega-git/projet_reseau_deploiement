package com.letsgo.education_service.dto.apiDto.fileStorageServiceDto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {

  
    
    private UUID id;

    private String url;

    private String fileName;


    private String contentType;

    private long duration;
    
}
