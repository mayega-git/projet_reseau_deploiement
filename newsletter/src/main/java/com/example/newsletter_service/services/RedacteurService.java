package com.example.newsletter_service.services;

import com.example.newsletter_service.dto.RedacteurRegistrationRequest;
import com.example.newsletter_service.dto.RedacteurResponse;
import com.example.newsletter_service.models.Redacteur;
import com.example.newsletter_service.exception.ResourceNotFoundException;
import com.example.newsletter_service.repositories.RedacteurRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedacteurService {
    
    private final RedacteurRepository redacteurRepository;
   
    
    /**
     * Inscription d'un nouveau rédacteur
     */
    @Transactional
    public Mono<RedacteurResponse> registerRedacteur(RedacteurRegistrationRequest request) {

        log.info(" Inscription d'un nouveau rédacteur: {}", request.getEmail());

        return redacteurRepository.existsByEmail(request.getEmail())
            .flatMap(exists -> {
                if (exists) {
                    return Mono.error(
                        new IllegalArgumentException("Cet email est déjà utilisé")
                    );
                }

                Redacteur redacteur = Redacteur.builder()
                    .email(request.getEmail())          
                    .password(request.getPassword())    
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .createdAt(LocalDateTime.now())
                    .build();

                return redacteurRepository.save(redacteur);
            })
            .map(this::mapToResponse)
            .doOnSuccess(response ->
                log.info(" Rédacteur {} inscrit avec succès", response.getEmail())
            );
    }

    /**
     * Récupérer tous les rédacteurs
     */
    public Flux<RedacteurResponse> getAllRedacteurs() {
        return redacteurRepository.findAll()
            .map(this::mapToResponse)
            .doOnComplete(() ->
                log.debug(" Liste des rédacteurs récupérée")
            );
    }

    /**
     * Récupérer un rédacteur par ID
     */
    public Mono<RedacteurResponse> getRedacteurById(UUID id) {
        return redacteurRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
            .map(this::mapToResponse);
    }

    private RedacteurResponse mapToResponse(Redacteur redacteur) {
        return RedacteurResponse.builder()
            .id(redacteur.getId())
            .email(redacteur.getEmail())
            .nom(redacteur.getNom())
            .prenom(redacteur.getPrenom())
            .createdAt(redacteur.getCreatedAt())
            .build();
    }
}