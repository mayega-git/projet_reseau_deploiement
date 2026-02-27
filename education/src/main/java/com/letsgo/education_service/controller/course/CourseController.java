package com.letsgo.education_service.controller.course;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.letsgo.education_service.dto.courseDto.CourseCreateDto;
import com.letsgo.education_service.models.Course;
import com.letsgo.education_service.service.coursService.courseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/education-service/education/courses")
public class CourseController {

    private final courseService service;

    @GetMapping
    public Flux<Course> getAll(
            @RequestParam(name = "authorId", required = false) String authorId,
            @RequestParam(name = "status", required = false) String status) {
        return service.getAll(authorId, status);
    }

    @GetMapping("/{id}")
    public Mono<Course> findCourseById(@PathVariable("id") String id) {
        return service.getById(id);
    }

    private final ObjectMapper objectMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<Course>> createCourse(
            @RequestPart("data") String createCourseDto,
            @RequestPart(value = "audio", required = false) Mono<FilePart> audioFile,
            @RequestPart(value = "cover", required = false) Mono<FilePart> coverFile) {

        log.info("=== CRÉATION COURS ===");
        log.info("JSON brut reçu (data) : {}", createCourseDto);
        log.info("Audio présent : {}", audioFile != null);
        log.info("Cover présent : {}", coverFile != null);

        return Mono.fromCallable(() -> {
            try {
                CourseCreateDto dto = objectMapper.readValue(createCourseDto, CourseCreateDto.class);
                log.info(
                        "✅ DTO parsé avec succès : title={}, authorId={}, domain={}, trainerName={}, level={}, duration={}, organisationId={}",
                        dto.getTitle(), dto.getAuthorId(), dto.getDomain(),
                        dto.getTrainerName(), dto.getLevel(), dto.getDuration(), dto.getOrganisationId());
                return dto;
            } catch (JsonProcessingException e) {
                log.error("❌ Erreur parsing JSON : {}", e.getMessage(), e);
                throw new IllegalArgumentException("JSON invalide : " + e.getMessage());
            }
        })
                .flatMap(createDTO -> {
                    log.info("Appel du service create...");
                    return service.create(createDTO, audioFile, coverFile);
                })
                .map(course -> {
                    log.info("✅ Cours créé avec succès : id={}", course.getId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(course);
                })
                .onErrorResume(IllegalArgumentException.class, e -> {
                    log.error("❌ Erreur de validation (400) : {}", e.getMessage(), e);
                    Course errorCourse = new Course();
                    errorCourse.setTitle("Erreur de validation");
                    errorCourse.setDescription(e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(errorCourse));
                })
                .onErrorResume(Exception.class, e -> {
                    log.error("❌ Erreur serveur (500) : {}", e.getMessage(), e);
                    Course errorCourse = new Course();
                    errorCourse.setTitle("Erreur serveur");
                    errorCourse.setDescription("Une erreur interne s'est produite");
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorCourse));
                });
    }

    @GetMapping("count-by-author/{id}")
    public Mono<Integer> getCountByAuthor(@PathVariable("id") String authorId) {
        return service.getCountByAuthor(UUID.fromString(authorId));
    }

}
