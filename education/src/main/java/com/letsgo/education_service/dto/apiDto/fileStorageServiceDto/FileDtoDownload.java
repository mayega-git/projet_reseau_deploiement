package com.letsgo.education_service.dto.apiDto.fileStorageServiceDto;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileDtoDownload {

    private byte[] data;    
    private String filename;
    private String contentType;
    private Long duration;

    public FileDtoDownload(byte[] data,String filename,String contentType){

        this.data = data;
        this.filename = filename;
        this.contentType = contentType;
    }

    public Resource getResource() {
        return new ByteArrayResource(this.data);
    }

    
}
