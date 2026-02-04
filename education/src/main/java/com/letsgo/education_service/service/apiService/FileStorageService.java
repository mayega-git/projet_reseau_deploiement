package com.letsgo.education_service.service.apiService;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDto;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileDtoDownload;
import com.letsgo.education_service.dto.apiDto.fileStorageServiceDto.FileStorageTest;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class FileStorageService {

    private  final WebClient apiClientFileStorage;

    public FileStorageService(WebClient ApiClientFileStorage){
        this.apiClientFileStorage = ApiClientFileStorage;

    }


    public  Mono<FileStorageTest> testFile(){

        return apiClientFileStorage
                .get()
                .retrieve()
                .bodyToMono(FileStorageTest.class);

    }



    public Mono<FileDto> uploadFile(FilePart file){
        System.out.println("SERVICE LOCALFILESTORAGE EDUCATION");

        

        return apiClientFileStorage
                .post()
                .uri("/fileStorage/upload-file")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file",file))
                .retrieve()
                .bodyToMono(FileDto.class);

    }

    public Mono<FileStorageTest> Test(){

        return apiClientFileStorage
                .get()
                .uri("/fileStorage/test2")
                .retrieve()
                .bodyToMono(FileStorageTest.class);

    }


    public Mono<FileDtoDownload> getRessource(UUID idFile) {
    System.out.println("📂 Fetching file from storage: " + idFile);
    
    return apiClientFileStorage
        .get()
        .uri("/fileStorage/download/{idFile}", idFile)
        .exchangeToMono(clientResponse -> {
            if (!clientResponse.statusCode().is2xxSuccessful()) {
                System.err.println("File storage returned error: " + clientResponse.statusCode());
                return Mono.error(new ResponseStatusException(
                    clientResponse.statusCode(),
                    "Erreur lors de la récupération du fichier"
                ));
            }
            
            MediaType contentType = clientResponse.headers()
                .contentType()
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
            
            String contentDisposition = clientResponse.headers()
                .asHttpHeaders()
                .getFirst(HttpHeaders.CONTENT_DISPOSITION);
            
            
            return clientResponse.bodyToMono(byte[].class)
                .map(bytes -> {
                    System.out.println("✅ Bytes received: " + bytes.length);
                    return new FileDtoDownload(
                        bytes,           // Resource directement
                        contentDisposition, // Filename
                        contentType.toString()
                    );
                });
            
            
        })
        .doOnError(e -> {
            System.err.println("Error fetching from file storage: " + e.getMessage());
            e.printStackTrace();
        });

}


    


    
}
