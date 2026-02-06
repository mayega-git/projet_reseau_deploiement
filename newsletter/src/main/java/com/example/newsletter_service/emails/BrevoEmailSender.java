package com.example.newsletter_service.emails;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Implémentation de l'envoi d'emails via l'API Brevo (ex-Sendinblue).
 * 
 * AVANTAGES:
 * - 300 emails/jour sur le plan gratuit
 * - API simple avec une seule clé
 * - Pas de vérification d'entreprise requise
 * 
 * Pour activer: app.email.provider=brevo
 * Variable d'environnement: BREVO_API_KEY
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.provider", havingValue = "brevo", matchIfMissing = false)
public class BrevoEmailSender implements EmailSender {

    private final EmailProperties emailProperties;
    private WebClient webClient;

    @PostConstruct
    public void init() {
        String apiKey = emailProperties.getBrevoApiKey();

        // FALLBACK si Spring n'a pas résolu la variable
        if (apiKey == null || apiKey.startsWith("${")) {
            log.warn("⚠️ Spring n'a pas résolu BREVO_API_KEY. Recherche dans l'ENV...");
            apiKey = findEnvVarFuzzy("BREVO_API_KEY");
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.error("❌ ECHEC: Clé API Brevo introuvable. Définissez BREVO_API_KEY");
            return;
        }

        apiKey = apiKey.trim();

        // Masquage pour les logs
        String maskedKey = (apiKey.length() > 8)
                ? apiKey.substring(0, 8) + "****"
                : "SHORT";

        log.info("🔐 [Brevo Init] API Key: {}", maskedKey);

        this.webClient = WebClient.builder()
                .baseUrl("https://api.brevo.com")
                .defaultHeader("api-key", apiKey)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();

        log.info("✅ [Brevo] WebClient initialisé avec succès");
    }

    @Override
    public Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from) {
        log.info("[Brevo] Envoi d'email à : {}", to);

        String senderEmail = from != null ? from : emailProperties.getDefaultFrom();
        String senderName = "Newsletter";

        // Corps de la requête Brevo API v3
        String requestBody = """
                {
                    "sender": {
                        "email": "%s",
                        "name": "%s"
                    },
                    "to": [
                        {
                            "email": "%s"
                        }
                    ],
                    "subject": "%s",
                    "htmlContent": %s
                }
                """.formatted(
                senderEmail,
                senderName,
                to,
                escapeJson(subject),
                toJsonString(htmlContent));

        if (webClient == null) {
            return Mono.error(new IllegalStateException("Brevo WebClient not initialized (API Key missing)"));
        }

        return webClient.post()
                .uri("/v3/smtp/email")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(
                        response -> log.info("[Brevo] ✅ Email envoyé avec succès à {} - Response: {}", to, response))
                .doOnError(error -> log.error("[Brevo] ❌ Erreur d'envoi à {} : {}", to, error.getMessage()))
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

    private String findEnvVarFuzzy(String exactKey) {
        String val = System.getenv(exactKey);
        if (val != null)
            return val;

        // Recherche des clés avec espaces
        for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
            if (entry.getKey().trim().equals(exactKey)) {
                log.warn("✅ Correction automatique: Variable trouvée avec espaces : '{}'", entry.getKey());
                return entry.getValue();
            }
        }
        return null;
    }
}
