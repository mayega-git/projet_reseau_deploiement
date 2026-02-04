package com.example.newsletter_service.emails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService2 {

    private final EmailSender emailSender;
    private final EmailProperties emailProperties;

    public Mono<Void> envoyerEmail(String destinataire, String sujet, String contenu) {
        log.info("Tentative d'envoi d'email à : {}", destinataire);

        return emailSender.sendHtmlEmail(
                destinataire,
                sujet,
                contenu,
                emailProperties.getDefaultFrom())
                .doOnSuccess(v -> log.info("Email envoyé avec succès à : {}", destinataire))
                .doOnError(
                        e -> log.error("Erreur lors de l'envoi de l'email à {} : {}", destinataire, e.getMessage(), e));
    }
}
