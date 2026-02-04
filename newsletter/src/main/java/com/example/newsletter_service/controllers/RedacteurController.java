package com.example.newsletter_service.controllers;

import com.example.newsletter_service.dto.RedacteurRequestResponse;
import com.example.newsletter_service.dto.RedacteurRequestSubmission;
import com.example.newsletter_service.services.RedacteurApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/education-service/newsletter/redacteurs")
@Slf4j
@RequiredArgsConstructor
public class RedacteurController {
    
    private final RedacteurApprovalService approvalService;
    
    /**
     * Soumettre une demande d'inscription
     * POST /api/redacteurs/request
     */
    @PostMapping("/request")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<RedacteurRequestResponse> submitRegistrationRequest(
            @Valid @RequestBody RedacteurRequestSubmission request) {
        
        log.info(" Réception demande d'inscription pour: {}", request.getEmail());
        
        return approvalService.submitRequest(request);
    }
    
    /**
     * Vérifier le statut d'une demande
     * GET /api/redacteurs/request/{id}
     */
    @GetMapping("/request/{id}")
    public Mono<RedacteurRequestResponse> getRequestStatus(@PathVariable("id") String id) {
        
        log.info(" Consultation statut demande: {}", id);
        
        return approvalService.getRequestById(java.util.UUID.fromString(id));
    }

    @GetMapping("/email")
    public Mono<Boolean> checkEmailExists(@RequestParam(name = "email") String email) {
        return approvalService.emailExists(email);
    }
}