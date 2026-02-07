package com.example.newsletter_service.emails;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import sendinblue.ApiClient;
import sendinblue.Configuration;
import sendinblue.auth.ApiKeyAuth;
import sibApi.TransactionalEmailsApi;
import sibModel.CreateSmtpEmail;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailSender;
import sibModel.SendSmtpEmailTo;

import java.util.Collections;
import java.util.Map;

/**
 * Implémentation de l'envoi d'emails via l'API Brevo (ex-Sendinblue).
 * Utilise le SDK officiel Brevo pour une meilleure fiabilité et maintenabilité.
 * Pour activer: app.email.provider=brevo
 * Variable d'environnement: BREVO_API_KEY
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.provider", havingValue = "brevo", matchIfMissing = false)
public class BrevoEmailSender implements EmailSender {

    private final EmailProperties emailProperties;
    private TransactionalEmailsApi apiInstance;

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
            throw new IllegalStateException(
                "BREVO_API_KEY est obligatoire. Configurez-la dans Railway ou application.yml"
            );
        }

        apiKey = apiKey.trim();

        // Masquage pour les logs
        String maskedKey = (apiKey.length() > 8)
                ? apiKey.substring(0, 8) + "****"
                : "SHORT";

        log.info("🔐 [Brevo Init] API Key: {}", maskedKey);

        try {
            // Initialisation du client API Brevo
            ApiClient defaultClient = Configuration.getDefaultApiClient();
            
            // Configuration de l'authentification
            ApiKeyAuth apiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("api-key");
            apiKeyAuth.setApiKey(apiKey);
            
            // Configuration des timeouts (optionnel mais recommandé)
            defaultClient.setConnectTimeout(30000); // 30 secondes
            defaultClient.setReadTimeout(30000);
            
            // Initialisation de l'API transactionnelle
            this.apiInstance = new TransactionalEmailsApi(defaultClient);
            
            log.info("✅ [Brevo] SDK initialisé avec succès");
            
        } catch (Exception e) {
            log.error("❌ [Brevo] Erreur lors de l'initialisation du SDK", e);
            throw new IllegalStateException("Impossible d'initialiser le SDK Brevo", e);
        }
    }

@Override
public Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from) {
    log.info("[Brevo] Envoi d'email à : {}", to);

    String senderEmail = (from != null && !from.isBlank())
            ? from
            : emailProperties.getDefaultFrom();

    if (senderEmail == null || senderEmail.isBlank()) {
        return Mono.error(new IllegalStateException(
            "❌ Brevo exige un sender.email non nul. Vérifie app.email.default-from"
        ));
    }

    String senderName = emailProperties.getDefaultFromName();
    if (senderName == null || senderName.isBlank()) {
        senderName = "Newsletter";
    }

    if (apiInstance == null) {
        return Mono.error(new IllegalStateException(
            "Brevo SDK non initialisé"
        ));
    }

    final String finalSenderEmail = senderEmail.trim();
    final String finalSenderName = senderName.trim();

    return Mono.fromCallable(() -> {
        SendSmtpEmail email = new SendSmtpEmail();

        // 🔴 sender OBLIGATOIRE et VALIDÉ chez Brevo
        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail(finalSenderEmail);
        sender.setName(finalSenderName);
        email.setSender(sender);

        SendSmtpEmailTo recipient = new SendSmtpEmailTo();
        recipient.setEmail(to);
        email.setTo(Collections.singletonList(recipient));

        email.setSubject(subject);
        email.setHtmlContent(htmlContent);
        email.setTags(Collections.singletonList("newsletter"));

        CreateSmtpEmail response = apiInstance.sendTransacEmail(email);

        log.info("✅ [Brevo] Email envoyé → {} | messageId={}",
                to, response.getMessageId());

        return response;
    }).then();
}



    /**
     * Recherche une variable d'environnement avec gestion des espaces
     */
    private String findEnvVarFuzzy(String exactKey) {
        String val = System.getenv(exactKey);
        if (val != null) {
            return val;
        }

        // Recherche des clés avec espaces ou variations
        for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
            if (entry.getKey().trim().equals(exactKey)) {
                log.warn("✅ Correction automatique: Variable trouvée avec espaces : '{}'", 
                    entry.getKey());
                return entry.getValue();
            }
        }
        
        log.warn("❌ Variable {} introuvable dans l'environnement", exactKey);
        return null;
    }
}