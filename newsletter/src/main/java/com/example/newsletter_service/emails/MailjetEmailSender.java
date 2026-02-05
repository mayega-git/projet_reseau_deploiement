package com.example.newsletter_service.emails;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

/**
 * Implémentation de l'envoi d'emails via l'API Mailjet.
 * 
 * LIMITATIONS DU PLAN GRATUIT:
 * - 200 emails/jour
 * - 6000 emails/mois
 * - Logo Mailjet dans le footer
 * 
 * AVANTAGES:
 * - Pas de vérification d'entreprise requise
 * - Envoi à n'importe quelle adresse email
 * - API simple avec Basic Auth
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.provider", havingValue = "mailjet", matchIfMissing = false)
public class MailjetEmailSender implements EmailSender {

    private final EmailProperties emailProperties;
    private WebClient webClient;

    @PostConstruct
    public void init() {
        // Créer le WebClient une seule fois au démarrage
        String apiKey = emailProperties.getMailjetApiKey();
        String secretKey = emailProperties.getMailjetSecretKey();

        // FALLBACK INTELLIGENT
        if (apiKey != null && apiKey.startsWith("${")) {
            log.warn("⚠️ Spring n'a pas résolu MAILJET_API_KEY. Recherche intelligente dans l'ENV...");
            apiKey = findEnvVarFuzzy("MAILJET_API_KEY");
        }

        if (secretKey != null && secretKey.startsWith("${")) {
            secretKey = findEnvVarFuzzy("MAILJET_SECRET_KEY");
        }

        if (apiKey == null || secretKey == null) {
            log.error("❌ ECHEC TOTAL : Clés API Mailjet introuvables même après recherche approfondie.");
            // Au lieu de crasher, on log juste l'erreur pour ne pas bloquer le démarrage de
            // tout le backend
            // Mais l'envoi d'email échouera plus tard.
            return;
        }

        apiKey = apiKey.trim();
        secretKey = secretKey.trim();

        String credentials = apiKey + ":" + secretKey;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        // Masquage des logs
        String maskedKey = (apiKey.length() > 4) ? apiKey.substring(0, 4) + "****" : "SHORT";
        String maskedAuth = (encodedCredentials.length() > 6) ? encodedCredentials.substring(0, 6) + "******" : "SHORT";

        log.info("🔐 [Mailjet Init] API Key: {} | Secret len: {} | Auth Header: Basic {}", maskedKey,
                secretKey.length(), maskedAuth);

        this.webClient = WebClient.builder()
                .baseUrl("https://api.mailjet.com")
                .defaultHeader("Authorization", "Basic " + encodedCredentials)
                .defaultHeader("Content-Type", "application/json")
                .build();

        log.info("✅ [Mailjet] WebClient initialisé avec succès");
    }

    @Override
    public Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from) {
        log.info("[Mailjet] Envoi d'email à : {}", to);

        String senderEmail = from != null ? from : emailProperties.getDefaultFrom();
        String senderName = "Newsletter";

        // Corps de la requête Mailjet API v3.1
        String requestBody = """
                {
                    "Messages": [
                        {
                            "From": {
                                "Email": "%s",
                                "Name": "%s"
                            },
                            "To": [
                                {
                                    "Email": "%s"
                                }
                            ],
                            "Subject": "%s",
                            "HTMLPart": %s
                        }
                    ]
                }
                """.formatted(
                senderEmail,
                senderName,
                to,
                escapeJson(subject),
                toJsonString(htmlContent));

        if (webClient == null) {
            return Mono.error(new IllegalStateException("Mailjet WebClient not initialized (Keys missing)"));
        }

        return webClient.post()
                .uri("/v3.1/send")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(
                        response -> log.info("[Mailjet] Email envoyé avec succès à {} - Response: {}", to, response))
                .doOnError(error -> log.error("[Mailjet] Erreur d'envoi à {} : {}", to, error.getMessage()))
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

        // Search for keys with trailing whitespace
        for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
            if (entry.getKey().trim().equals(exactKey)) {
                log.warn("✅ Correction automatique: Variable trouvée avec espaces : '{}'", entry.getKey());
                return entry.getValue();
            }
        }
        return null;
    }
}
