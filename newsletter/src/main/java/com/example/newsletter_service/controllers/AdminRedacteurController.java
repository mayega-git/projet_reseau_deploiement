package com.example.newsletter_service.controllers;

import com.example.newsletter_service.dto.ApprovalRequest;
import com.example.newsletter_service.dto.RedacteurRequestResponse;
import com.example.newsletter_service.dto.RejectionRequest;
import com.example.newsletter_service.services.RedacteurApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import jakarta.validation.Valid;
import java.util.UUID;

/**
 * Controller pour les opérations d'administration des demandes de rédacteurs
 * IMPORTANT: Ces endpoints doivent être protégés par Spring Security
 * (ROLE_ADMIN)
 */
@RestController
@RequestMapping("/education-service/newsletter/admin/redacteurs")
@Slf4j
@RequiredArgsConstructor
public class AdminRedacteurController {

    private final RedacteurApprovalService approvalService;

    /**
     * Récupérer toutes les demandes en attente
     * GET /api/admin/redacteurs/pending
     */
    @GetMapping("/pending")
    public Flux<RedacteurRequestResponse> getPendingRequests(
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size) {

        log.info(" Admin - Récupération des demandes en attente");

        if (page != null && size != null) {
            return approvalService.getPendingRequests(page, size);
        }

        return approvalService.getPendingRequests();
    }

    /**
     * Compter les demandes en attente
     * GET /api/admin/redacteurs/pending/count
     */
    @GetMapping("/pending/count")
    public Mono<Long> countPendingRequests() {
        log.info(" Admin - Comptage des demandes en attente");

        return approvalService.countPendingRequests();
    }

    /**
     * Récupérer toutes les demandes (tous statuts)
     * GET /api/admin/redacteurs/requests
     */
    @GetMapping("/requests")
    public Flux<RedacteurRequestResponse> getAllRequests() {
        log.info(" Admin - Récupération de toutes les demandes");

        return approvalService.getAllRequests();
    }

    /**
     * Récupérer une demande spécifique
     * GET /api/admin/redacteurs/requests/{id}
     */
    @GetMapping("/requests/{id}")
    public Mono<RedacteurRequestResponse> getRequest(@PathVariable("id") UUID id) {
        log.info("🔍 Admin - Consultation demande: {}", id);

        return approvalService.getRequestById(id);
    }

    /**
     * Approuver une demande d'inscription
     * POST /api/admin/redacteurs/requests/{id}/approve
     */
    @PostMapping("/requests/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public Mono<RedacteurRequestResponse> approveRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ApprovalRequest request) {

        log.info(" Admin {} - Approbation demande: {}", id);

        return approvalService.approveRequest(id);
    }

    /**
     * Rejeter une demande d'inscription
     * POST /api/admin/redacteurs/requests/{id}/reject
     */
    @PostMapping("/requests/{id}/reject")
    @ResponseStatus(HttpStatus.OK)
    public Mono<RedacteurRequestResponse> rejectRequest(
            @PathVariable("id") UUID id,
            @Valid @RequestBody RejectionRequest request) {

        log.info(" Admin {} - Rejet demande: {}", id);

        return approvalService.rejectRequest(id, request.getReason());
    }
}