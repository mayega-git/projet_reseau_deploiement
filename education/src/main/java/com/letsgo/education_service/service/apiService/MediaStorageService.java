package com.letsgo.education_service.service.apiService;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaStorageService {


    private final WebClient webClient;

    private final ObjectMapper objectMapper;

    private  String service = "education-service";

    

    public Mono<MediaUploadResponse> uploadFile(Mono<FilePart> file,String location){

        return uploadMedia(file,location)
            .doOnSubscribe(s -> System.out.println("SOUSCRIPTION à uploadMedia"))
            .doOnNext(response -> System.out.println(" RÉPONSE reçue: " + response))
            .doOnError(error -> System.err.println(" ERREUR dans uploadBlogFile: " + error.getMessage()))
            .doFinally(signal -> System.out.println(" uploadBlogFile TERMINÉ avec signal: " + signal));
    }

    public Mono<MediaUploadResponse> uploadMedia(Mono<FilePart> fileMono,String location) {

            return fileMono.flatMap(file ->{
            log.info(" Upload: {}", file.filename());

            MediaType mediaType = Optional
                    .ofNullable(file.headers().getContentType())
                    .orElse(MediaType.APPLICATION_OCTET_STREAM);

            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.asyncPart("file", file.content(), DataBuffer.class)
                .filename(file.filename())
                .contentType(mediaType);

            builder.part("service", service);
            builder.part("location", location);

            return webClient
                .post()
                .uri("/media/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(builder.build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(root -> {

                    ObjectMapper mapper = new ObjectMapper();
                    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

                    // CAS ÉCHEC (format {status, message, ok})
                    if (root.has("ok") && !root.path("ok").asBoolean()) {
                        String message = root.path("message").asText("Upload failed");
                        log.error(" Upload media échoué: {}", message);
                        return Mono.error(new RuntimeException(message));
                    }

                    //  CAS SUCCÈS (MediaUploadResponse direct json)
                    try {
                        MediaUploadResponse response =
                                mapper.treeToValue(root, MediaUploadResponse.class);

                        log.info(" Upload réussi - ID={}", response.getId());
                        return Mono.just(response);

                    } catch (Exception e) {
                        log.error(" Mapping MediaUploadResponse echec", e);
                        return Mono.error(e);
                    }
                });

            })
                .doOnError(e -> log.error("Upload failed (terminal)", e));
    }


    public Flux<DataBuffer> getFile(UUID mediaId) {
        log.info(" Stream média: {}", mediaId);
        
        return webClient
            .get()
            .uri("/media/{id}", mediaId)
            .accept(MediaType.ALL)
            .retrieve()
            .bodyToFlux(DataBuffer.class)
            .doOnComplete(() -> log.info("Stream terminé"))
            .doOnError(e -> log.error(" Erreur stream: {}", e.getMessage()));
    }

    
}