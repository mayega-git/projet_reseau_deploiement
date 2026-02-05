package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.RedacteurRequestResponse;
import com.example.newsletter_service.dto.RedacteurRequestSubmission;
import com.example.newsletter_service.exception.ResourceNotFoundException;
import com.example.newsletter_service.models.Redacteur;
import com.example.newsletter_service.emails.EmailService1;
import com.example.newsletter_service.enums.RedacteurStatus;
import com.example.newsletter_service.repositories.RedacteurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedacteurApprovalService {

    private final RedacteurRepository redacteurRepository;
    private final EmailService1 emailService;

    /**
     * Soumettre une demande d'inscription
     */
    @Transactional
    public Mono<RedacteurRequestResponse> submitRequest(RedacteurRequestSubmission submission) {
        log.info(" Nouvelle demande d'inscription pour: {}", submission.getEmail());

        // Vérifier si un rédacteur avec cet email existe déjà
        return redacteurRepository.existsByEmail(submission.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(
                                new IllegalArgumentException("Une demande existe déjà pour cet email"));
                    }

                    // Créer le rédacteur avec le statut PENDING
                    Redacteur redacteur = Redacteur.builder()
                            .email(submission.getEmail())
                            .password(submission.getPassword()) // TODO: Hasher le mot de passe
                            .nom(submission.getNom())
                            .prenom(submission.getPrenom())
                            .status(RedacteurStatus.PENDING)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return redacteurRepository.save(redacteur);
                })
                .map(this::mapToResponse)
                .doOnSuccess(response -> log.info(" Demande créée avec succès - ID: {}", response.getId()));
    }

    /**
     * Récupérer toutes les demandes en attente
     */
    public Flux<RedacteurRequestResponse> getPendingRequests() {
        log.debug(" Récupération des demandes en attente");

        return redacteurRepository.findByStatusOrderByCreatedAtDesc(RedacteurStatus.PENDING)
                .map(this::mapToResponse);
    }

    /**
     * Récupérer les demandes en attente avec pagination
     */
    public Flux<RedacteurRequestResponse> getPendingRequests(int page, int size) {
        log.debug(" Récupération des demandes en attente - Page: {}, Size: {}", page, size);

        return redacteurRepository.findByStatusOrderByCreatedAtDesc(
                RedacteurStatus.PENDING,
                PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    /**
     * Compter les demandes en attente
     */
    public Mono<Long> countPendingRequests() {
        return redacteurRepository.countByStatus(RedacteurStatus.PENDING);
    }

    /**
     * Récupérer une demande par ID
     */
    public Mono<RedacteurRequestResponse> getRequestById(UUID id) {
        return redacteurRepository.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
                .map(this::mapToResponse);
    }

    /**
     * Approuver une demande
     */
    @Transactional
    public Mono<RedacteurRequestResponse> approveRequest(UUID requestId) {
        log.info(" Approbation de la demande {} par l'admin {}", requestId);

        return redacteurRepository.findById(requestId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(requestId)))
                .flatMap(redacteur -> {
                    if (redacteur.getStatus() != RedacteurStatus.PENDING) {
                        return Mono.error(
                                new IllegalStateException("Cette demande a déjà été traitée"));
                    }

                    // Mettre à jour le statut à APPROVED
                    redacteur.setStatus(RedacteurStatus.APPROVED);
                    redacteur.setProcessedAt(LocalDateTime.now());

                    return redacteurRepository.save(redacteur);
                })
                .flatMap(approvedRedacteur -> {
                    // Envoyer email d'approbation
                    return emailService.sendApprovalEmail(
                            approvedRedacteur.getEmail(),
                            approvedRedacteur.getNom(),
                            approvedRedacteur.getPrenom()).thenReturn(approvedRedacteur);
                })
                .map(this::mapToResponse)
                .doOnSuccess(response -> log.info(" Demande {} approuvée avec succès", requestId));
    }

    /**
     * Rejeter une demande
     */
    @Transactional
    public Mono<RedacteurRequestResponse> rejectRequest(UUID requestId, String reason) {
        log.info(" Rejet de la demande {} par l'admin {}", requestId);

        return redacteurRepository.findById(requestId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(requestId)))
                .flatMap(redacteur -> {
                    if (redacteur.getStatus() != RedacteurStatus.PENDING) {
                        return Mono.error(
                                new IllegalStateException("Cette demande a déjà été traitée"));
                    }

                    // Mettre à jour le statut à REJECTED
                    redacteur.setStatus(RedacteurStatus.REJECTED);
                    redacteur.setProcessedAt(LocalDateTime.now());
                    redacteur.setRejectionReason(reason);

                    return redacteurRepository.save(redacteur);
                })
                .flatMap(rejectedRedacteur -> {
                    // Envoyer email de rejet
                    return emailService.sendRejectionEmail(
                            rejectedRedacteur.getEmail(),
                            rejectedRedacteur.getNom(),
                            rejectedRedacteur.getPrenom(),
                            rejectedRedacteur.getRejectionReason()).thenReturn(rejectedRedacteur);
                })
                .map(this::mapToResponse)
                .doOnSuccess(response -> log.info(" Demande {} rejetée avec succès", requestId));
    }

    /**
     * Récupérer toutes les demandes (tous statuts)
     */
    public Flux<RedacteurRequestResponse> getAllRequests() {
        return redacteurRepository.findAll()
                .map(this::mapToResponse);
    }

    /**
     * Récupérer tous les rédacteurs actifs (approuvés)
     */
    public Flux<Redacteur> getActiveRedacteurs() {
        return redacteurRepository.findAllActiveRedacteurs();
    }

    /**
     * Mapper Redacteur vers RedacteurRequestResponse
     */
    private RedacteurRequestResponse mapToResponse(Redacteur redacteur) {
        return RedacteurRequestResponse.builder()
                .id(redacteur.getId())
                .email(redacteur.getEmail())
                .nom(redacteur.getNom())
                .prenom(redacteur.getPrenom())
                .status(redacteur.getStatus())
                .createdAt(redacteur.getCreatedAt())
                .processedAt(redacteur.getProcessedAt())
                .rejectionReason(redacteur.getRejectionReason())
                .build();
    }

    public Mono<Redacteur> findByEmail(String email) {
        log.debug("Recherche du rédacteur par email : {}", email);
        return redacteurRepository.findByEmail(email);
    }
}