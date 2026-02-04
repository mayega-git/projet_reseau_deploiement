/*package com.letsgo.education_service.controller.fileStorageService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDto;
import com.letsgo.education_service.service.apiService.FileStorageService;

import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/fileStorage")
public class FileStorageController {

    @Autowired
    private final FileStorageService fileStorageService;


    FileStorageController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }


    @PostMapping(value="/education-fileStorage" , consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<FileDto> uploadFile(@RequestPart(value="file" ) FilePart file) {
        System.out.println("CONTROLEUR LOCALFILESTORAGE EDUCATION");
        return fileStorageService.uploadFile(file);

        
    }
    

    
}*/
