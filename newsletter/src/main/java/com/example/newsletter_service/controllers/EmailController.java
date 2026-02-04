package com.example.newsletter_service.controllers;


import com.example.newsletter_service.dto.EmailRequestDto;
import com.example.newsletter_service.emails.EmailService2;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/education-service/newsletter/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService2 emailService;

    @PostMapping("/send")
    public Mono<ResponseEntity<Map<String, String>>> envoyerEmail(@Valid @RequestBody EmailRequestDto request) {
        log.debug("Réception d'une demande d'envoi d'email vers : {}", request.emailDestinataire());
        
        return emailService.envoyerEmail(
                        request.emailDestinataire(),
                        request.sujet(),
                        request.contenuEmail()
                )
                .then(Mono.just(ResponseEntity
                        .ok(Map.of("message", "Email envoyé avec succès"))
                ))
                .onErrorResume(e -> {
                    log.error("Échec de l'envoi de l'email", e);
                    return Mono.just(ResponseEntity
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("erreur", "Échec de l'envoi de l'email : " + e.getMessage()))
                    );
                });
    }
}