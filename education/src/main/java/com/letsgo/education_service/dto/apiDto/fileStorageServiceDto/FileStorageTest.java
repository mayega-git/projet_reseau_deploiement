package com.letsgo.education_service.dto.apiDto.fileStorageServiceDto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FileStorageTest {

    private String test;

    public FileStorageTest(String test){
        this.test =test;
    }
    
}
