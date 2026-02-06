package com.example.newsletter_service.emails;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Propriétés de configuration pour l'envoi d'emails via Brevo.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {

    /**
     * Provider d'email: "smtp" ou "brevo"
     */
    private String provider = "brevo";

    /**
     * Clé API Brevo
     */
    private String brevoApiKey;

    /**
     * Adresse email par défaut de l'expéditeur
     */
    private String defaultFrom = "newsletter@example.com";
}
