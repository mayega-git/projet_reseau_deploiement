package com.example.newsletter_service.emails;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Propriétés de configuration pour l'envoi d'emails.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {

    /**
     * Provider d'email: "smtp" ou "resend"
     */
    private String provider = "smtp";

    /**
     * Clé API Resend (uniquement si provider = resend)
     */
    private String resendApiKey;

    /**
     * Adresse email par défaut de l'expéditeur
     */
    private String defaultFrom = "noreply@example.com";
}
