package com.example.newsletter_service.emails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Implémentation de l'envoi d'emails via l'API HTTP Resend.
 * Utilisé en production où SMTP est bloqué par les firewalls cloud.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.provider", havingValue = "resend", matchIfMissing = false)
public class ResendEmailSender implements EmailSender {

    private final WebClient.Builder webClientBuilder;
    private final EmailProperties emailProperties;

    @Override
    public Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from) {
        log.info("📧 [Resend] Envoi d'email à : {}", to);

        WebClient webClient = webClientBuilder
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + emailProperties.getResendApiKey())
                .defaultHeader("Content-Type", "application/json")
                .build();

        String requestBody = """
                {
                    "from": "%s",
                    "to": ["%s"],
                    "subject": "%s",
                    "html": %s
                }
                """.formatted(
                from != null ? from : emailProperties.getDefaultFrom(),
                to,
                escapeJson(subject),
                toJsonString(htmlContent));

        return webClient.post()
                .uri("/emails")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> log.info("✅ [Resend] Email envoyé avec succès à {}", to))
                .doOnError(error -> log.error("❌ [Resend] Erreur d'envoi à {} : {}", to, error.getMessage()))
                .then();
    }

    private String escapeJson(String text) {
        if (text == null)
            return "";
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String toJsonString(String html) {
        return "\"" + escapeJson(html) + "\"";
    }
}
