package com.example.newsletter_service.emails;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Propriétés de configuration pour l'envoi d'emails via Mailjet.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.email")
public class EmailProperties {

    /**
     * Provider d'email: "smtp" ou "mailjet"
     */
    private String provider = "mailjet";

    /**
     * Clé API Mailjet (publique)
     */
    private String mailjetApiKey;

    /**
     * Clé secrète Mailjet
     */
    private String mailjetSecretKey;

    /**
     * Adresse email par défaut de l'expéditeur
     */
    private String defaultFrom = "newsletter@example.com";
}
