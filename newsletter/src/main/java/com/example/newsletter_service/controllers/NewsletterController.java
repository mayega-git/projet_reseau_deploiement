package com.example.newsletter_service.controllers;

import com.example.newsletter_service.dto.NewsletterCreateRequest;
import com.example.newsletter_service.enums.StatutNewsletter;

import com.example.newsletter_service.dto.NewsletterCreateRequest;
import com.example.newsletter_service.dto.NewsletterResponse;
import com.example.newsletter_service.models.Newsletter;
import com.example.newsletter_service.services.NewsletterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * Contrôleur REST pour les newsletters
 */
@Slf4j
@RestController
@RequestMapping("/education-service/newsletter/newsletters")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/newsletters")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<NewsletterResponse> createNewsletter(
            @RequestParam(name = "redacteurId") UUID redacteurId,
            @Valid @RequestBody NewsletterCreateRequest request) {
        return newsletterService.createNewsletter(redacteurId, request);
    }

    @PostMapping("/newsletters/{id}/submit")
    public Mono<NewsletterResponse> submitNewsletter(
            @PathVariable("id")  UUID id,
            @RequestParam(name = "redacteurId") UUID redacteurId) {
        return newsletterService.submitNewsletter(id, redacteurId);
    }

    @GetMapping("/newsletters/redacteur/{redacteurId}")
    public Flux<NewsletterResponse> getNewslettersByRedacteur(
            @PathVariable("redacteurId") UUID redacteurId) {
        return newsletterService.getNewslettersByRedacteur(redacteurId);
    }

    @GetMapping("/newsletters")
    public Flux<NewsletterResponse> getNewslettersByStatut(
            @RequestParam(name = "statut", required = false) StatutNewsletter statut) {
        if (statut != null) {
            return newsletterService.getNewslettersByStatut(statut);
        }
        return Flux.empty();
    }

    @PostMapping("/newsletters/{id}/validate")
    public Mono<NewsletterResponse> validateNewsletter(@PathVariable("id") UUID id) {
        return newsletterService.validateNewsletter(id);
    }

    @PostMapping("/newsletters/{id}/reject")
    public Mono<NewsletterResponse> rejectNewsletter(@PathVariable("id") UUID id) {
        return newsletterService.rejectNewsletter(id);
    }

    @PostMapping("/newsletters/{id}/publish")
    public Mono<NewsletterResponse> publishNewsletter(@PathVariable("id") UUID id) {
        return newsletterService.publishNewsletter(id);
    }
}
