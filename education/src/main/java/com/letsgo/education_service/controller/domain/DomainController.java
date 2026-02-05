package com.letsgo.education_service.controller.domain;

import com.letsgo.education_service.enums.Domain;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/education-service/education/domains")
public class DomainController {

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getAllDomains() {
        return Flux.fromArray(Domain.values())
                .map(Domain::getValue)
                .collectList();
    }
}
